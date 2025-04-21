import { useCallback, useEffect, useState } from 'react';

import { redirect } from 'next/navigation';

import { Badge } from '@/component/ui/badge';
import { Button } from '@/component/ui/button';
import { Calendar } from '@/component/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/component/ui/command';
import { DialogDescription, DialogHeader, DialogTitle } from '@/component/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/component/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/component/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/component/ui/popover';
import { Textarea } from '@/component/ui/textarea';

import { driver } from '@/constant/guide';
import { reserveModalDriver } from '@/constant/guide/reserve-modal';

import Api from '@/api';
import {
  ReservationDto,
  ReservationRequest,
  ReservationRequestSchema,
  ReservationStatus,
  Space,
} from '@/api/types/reservation';
import { UserDto } from '@/api/types/user';

import { useGuideStore } from '@/store/guide.store';
import { useModalStore } from '@/store/modal.store';
import { useUserStore } from '@/store/user.store';

import { useApiWithToast } from '@/hook/use-api';

import { clubName, cn, spaceName } from '@/lib/utils';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  addDays,
  addHours,
  endOfDay,
  format,
  isAfter,
  isBefore,
  parse,
  roundToNearestMinutes,
  startOfDay,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import _ from 'lodash';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useForm } from 'react-hook-form';

export interface ReserveModalProps {
  space: Space;
  onReserve: (reservation: ReservationDto) => void;
}

export default function ReserveModal({ space, onReserve }: ReserveModalProps) {
  const [isApiProcessing, startApi] = useApiWithToast();

  const { user } = useUserStore();
  const { close } = useModalStore();
  const { showGuide } = useGuideStore();

  const [inputQuery, setInputQuery] = useState('');
  const [query, setQuery] = useState('');
  const [searchedUsers, setSearchedUsers] = useState<UserDto[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserDto[]>([user!]);

  const form = useForm<ReservationRequest>({
    resolver: zodResolver(ReservationRequestSchema),
    mode: 'onChange',
    defaultValues: {
      participants: showGuide ? [user!.id, 'fake1', 'fake2'] : [user!.id],
      space,
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: showGuide
        ? '09:00'
        : format(roundToNearestMinutes(new Date(), { nearestTo: 10 }), 'HH:mm'),
      endTime: showGuide
        ? '10:30'
        : format(addHours(roundToNearestMinutes(new Date(), { nearestTo: 10 }), 1), 'HH:mm'),
      reason: showGuide ? 'Tably 예약 가이드입니다. (실제로 예약되지 않습니다.)' : '',
    },
  });

  const debouncedSetQuery = useCallback(
    _.debounce((value: string) => {
      setQuery(value);
    }, 300),
    [],
  );

  const handleInputChange = (value: string) => {
    setInputQuery(value);
    debouncedSetQuery(value);
  };

  const onSubmit = useCallback(
    (values: ReservationRequest) => {
      startApi(
        async () => {
          if (showGuide) {
            await new Promise((res) => setTimeout(res, 500));
            onReserve({
              id: 'test-reservation',
              participants: values.participants.map(
                (id) =>
                  ({
                    id,
                    club: user!.club,
                    name: user!.name,
                  }) as UserDto,
              ),
              club: user!.club,
              space: values.space,
              date: values.date,
              startTime: values.startTime + ':00',
              endTime: values.endTime + ':00',
              reason: values.reason,
              status: ReservationStatus.PENDING,
              returnPicture: null,
              returnedAt: null,
            });
          } else {
            const { reservation } = await Api.Domain.Reservation.reserve(values);
            onReserve(reservation);
          }
        },
        {
          loading: `${spaceName(values.space)}를 예약하고 있습니다.`,
          success: '예약 성공',
          finally: () => {
            close();
            redirect('/my-reservations');
          },
        },
      );
    },
    [onReserve, showGuide],
  );

  const startTime = form.watch('startTime');
  const endTime = form.watch('endTime');

  useEffect(() => {
    if (query.trim().length === 0) {
      setSearchedUsers([]);
      return;
    }

    (async () => {
      const { users } = await Api.Domain.User.getAllUser(query);
      setSearchedUsers(users);
    })();
  }, [query, setSearchedUsers]);

  useEffect(() => {
    if (!showGuide) return;

    driver.setConfig(reserveModalDriver);
    driver.drive();
  }, [showGuide]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>예약하기</DialogTitle>
        <DialogDescription>{spaceName(space)}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex w-full flex-col items-center space-y-4"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-full" id="reserve-modal-date">
                <FormLabel>사용 일자</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn('font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? (
                          format(
                            parse(field.value, 'yyyy-MM-dd', new Date()),
                            'yyyy년 MM월 dd일 (E)',
                            { locale: ko },
                          )
                        ) : (
                          <span>사용 일자를 선택해주세요.</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined
                      }
                      onSelect={(value) =>
                        field.onChange(value ? format(value, 'yyyy-MM-dd') : undefined)
                      }
                      disabled={(value) =>
                        isBefore(value, startOfDay(new Date())) ||
                        isAfter(value, endOfDay(addDays(new Date(), 7)))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full items-start gap-2">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="w-full" id="reserve-modal-start-time">
                  <FormLabel>사용 시작 시간</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="font-normal">
                            {field.value.split(':')[0]}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Array.from({ length: 15 })
                            .map((_, idx) => idx + 9)
                            .map((hour) => String(hour).padStart(2, '0'))
                            .map((hour) => (
                              <DropdownMenuItem
                                key={hour}
                                onClick={() => field.onChange(`${hour}:00`)}
                              >
                                {hour}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span>:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="font-normal"
                            disabled={parseInt(startTime.split(':')[0]) === 23}
                          >
                            {field.value.split(':')[1]}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Array.from({ length: 6 })
                            .map((_, idx) => idx * 10)
                            .map((minute) => String(minute).padStart(2, '0'))
                            .map((minute) => (
                              <DropdownMenuItem
                                key={minute}
                                onClick={() =>
                                  field.onChange(`${field.value.split(':')[0]}:${minute}`)
                                }
                              >
                                {minute}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="w-full" id="reserve-modal-end-time">
                  <FormLabel>사용 종료 시간</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="font-normal">
                            {field.value.split(':')[0]}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Array.from({ length: 15 })
                            .map((_, idx) => idx + 9)
                            .filter(
                              (hour) => hour >= parse(startTime, 'HH:mm', new Date()).getHours(),
                            )
                            .map((hour) => String(hour).padStart(2, '0'))
                            .map((hour) => (
                              <DropdownMenuItem
                                key={hour}
                                onClick={() =>
                                  field.onChange(`${hour}:${field.value.split(':')[1]}`)
                                }
                              >
                                {hour}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span>:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="font-normal"
                            disabled={parseInt(endTime.split(':')[0]) === 23}
                          >
                            {field.value.split(':')[1]}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Array.from({ length: 6 })
                            .map((_, idx) => idx * 10)
                            .filter((minute) =>
                              parse(startTime, 'HH:mm', new Date()).getHours() ===
                              parse(endTime, 'HH:mm', new Date()).getHours()
                                ? minute > parse(startTime, 'HH:mm', new Date()).getMinutes()
                                : true,
                            )
                            .map((minute) => String(minute).padStart(2, '0'))
                            .map((minute) => (
                              <DropdownMenuItem
                                key={minute}
                                onClick={() =>
                                  field.onChange(`${field.value.split(':')[0]}:${minute}`)
                                }
                              >
                                {minute}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="participants"
            render={({ field }) => (
              <FormItem className="w-full" id="reserve-modal-people">
                <FormLabel>사용 인원 ({selectedUsers.length}명)</FormLabel>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'flex h-auto justify-between font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <div className="flex flex-wrap gap-1">
                          {selectedUsers.map((user) => (
                            <Badge key={user.id} variant="secondary">
                              {user.name}
                            </Badge>
                          ))}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="검색"
                        value={inputQuery}
                        onValueChange={handleInputChange}
                      />
                      <CommandList>
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        {inputQuery.trim().length > 0
                          ? searchedUsers
                              .filter((u) => !selectedUsers.find((su) => su.id === u.id))
                              .map((u) => (
                                <CommandItem
                                  key={u.id}
                                  value={u.name}
                                  onSelect={() => {
                                    form.setValue('participants', [...field.value, u.id]);
                                    setSelectedUsers((value) => [...value, u]);
                                    setInputQuery('');
                                    setQuery('');
                                  }}
                                >
                                  {u.name}
                                  <span className="text-xs text-neutral-500">
                                    ({clubName(u.club)})
                                  </span>
                                </CommandItem>
                              ))
                          : selectedUsers.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={u.name}
                                onSelect={() => {
                                  if (u.id === user?.id) return;
                                  form.setValue(
                                    'participants',
                                    field.value.filter((id) => id !== u.id),
                                  );
                                  setSelectedUsers((value) =>
                                    value.filter((user) => user.id !== u.id),
                                  );
                                }}
                              >
                                {u.name}
                                <span className="text-xs text-neutral-500">
                                  ({clubName(u.club)})
                                </span>
                                <Check className="ml-auto h-4 w-4" />
                              </CommandItem>
                            ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="w-full" id="reserve-modal-reason">
                <FormLabel>사용 목적</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="사용 목적을 입력해주세요"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="self-end" disabled={isApiProcessing} id="reserve-modal-button">
            예약하기
          </Button>
        </form>
      </Form>
    </>
  );
}
