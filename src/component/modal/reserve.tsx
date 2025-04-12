import { useCallback, useEffect, useRef, useState } from 'react';

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/component/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/component/ui/popover';
import { Textarea } from '@/component/ui/textarea';
import { TimePickerInput } from '@/component/ui/time-picker-input';

import Api from '@/api';
import {
  ReservationDto,
  ReservationRequest,
  ReservationRequestSchema,
  Space,
} from '@/api/types/reservation';
import { UserDto } from '@/api/types/user';

import { useModalStore } from '@/store/modal.store';
import { useUserStore } from '@/store/user.store';

import { useApiWithToast } from '@/hook/use-api';

import { cn, spaceName } from '@/lib/utils';

import { zodResolver } from '@hookform/resolvers/zod';
import { addHours, format, isBefore, parse, roundToNearestMinutes, startOfDay } from 'date-fns';
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

  const [inputQuery, setInputQuery] = useState('');
  const [query, setQuery] = useState('');
  const [searchedUsers, setSearchedUsers] = useState<UserDto[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserDto[]>([user!]);

  const startHourRef = useRef<HTMLInputElement>(null);
  const startMinuteRef = useRef<HTMLInputElement>(null);

  const endHourRef = useRef<HTMLInputElement>(null);
  const endMinuteRef = useRef<HTMLInputElement>(null);

  const form = useForm<ReservationRequest>({
    resolver: zodResolver(ReservationRequestSchema),
    defaultValues: {
      participants: [user!.id],
      space,
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: format(roundToNearestMinutes(new Date(), { nearestTo: 10 }), 'HH:mm'),
      endTime: format(addHours(roundToNearestMinutes(new Date(), { nearestTo: 10 }), 1), 'HH:mm'),
      reason: '',
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
          const { reservation } = await Api.Domain.Reservation.reserve(values);
          onReserve(reservation);
        },
        {
          loading: `${spaceName(values.space)}를 예약하고 있습니다.`,
          success: '예약 성공',
          finally: close,
        },
      );
    },
    [onReserve],
  );

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
    console.log(searchedUsers);
  }, [searchedUsers]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>예약하기</DialogTitle>
        <DialogDescription>{spaceName(space)}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex w-[300px] flex-col items-center space-y-4"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-full">
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
                      disabled={(value) => isBefore(value, startOfDay(new Date()))}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full gap-2">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>사용 시작 시간</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      <TimePickerInput
                        picker="hours"
                        date={field.value ? parse(field.value, 'HH:mm', new Date()) : undefined}
                        setDate={(value) =>
                          field.onChange(value ? format(value, 'HH:mm') : undefined)
                        }
                        ref={startHourRef}
                        onRightFocus={() => startMinuteRef.current?.focus()}
                      />
                      <p>:</p>
                      <TimePickerInput
                        picker="minutes"
                        date={field.value ? parse(field.value, 'HH:mm', new Date()) : undefined}
                        setDate={(value) =>
                          field.onChange(value ? format(value, 'HH:mm') : undefined)
                        }
                        ref={startMinuteRef}
                        onLeftFocus={() => startHourRef.current?.focus()}
                      />
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
                <FormItem className="w-full">
                  <FormLabel>사용 종료 시간</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      <TimePickerInput
                        picker="hours"
                        date={field.value ? parse(field.value, 'HH:mm', new Date()) : undefined}
                        setDate={(value) =>
                          field.onChange(value ? format(value, 'HH:mm') : undefined)
                        }
                        ref={endHourRef}
                        onRightFocus={() => endMinuteRef.current?.focus()}
                      />
                      <p>:</p>
                      <TimePickerInput
                        picker="minutes"
                        date={field.value ? parse(field.value, 'HH:mm', new Date()) : undefined}
                        setDate={(value) =>
                          field.onChange(value ? format(value, 'HH:mm') : undefined)
                        }
                        ref={endMinuteRef}
                        onLeftFocus={() => endHourRef.current?.focus()}
                      />
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
              <FormItem className="w-full">
                <FormLabel>사용 인원</FormLabel>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value.length}명
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
                                  <span className="text-xs text-neutral-500">({u.club})</span>
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
                                <span className="text-xs text-neutral-500">({u.club})</span>
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
              <FormItem className="w-full">
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

          <Button className="self-end" disabled={isApiProcessing}>
            예약하기
          </Button>
        </form>
      </Form>
    </>
  );
}
