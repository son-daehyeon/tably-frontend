'use client';

import { useCallback } from 'react';

import Image from 'next/image';

import { Button } from '@/component/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/component/ui/form';
import { Input } from '@/component/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/component/ui/select';

import Api from '@/api';
import { Club, SignUpRequest, SignUpRequestSchema } from '@/api/types/user';

import { useUserStore } from '@/store/user.store';

import { useApiWithToast } from '@/hook/use-api';

import { clubName } from '@/lib/utils';

import SoftwareLogo from '@/public/software.png';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function Page() {
  const { setUser } = useUserStore();

  const [isApiProcessing, startApi] = useApiWithToast();

  const form = useForm<SignUpRequest>({
    resolver: zodResolver(SignUpRequestSchema),
    defaultValues: {
      name: '',
      club: undefined,
    },
  });

  const onSubmit = useCallback((values: SignUpRequest) => {
    startApi(
      async () => {
        const { user } = await Api.Domain.User.signUp(values);
        setUser(user);
      },
      {
        loading: '회원가입을 하고 있습니다.',
        success: '회원가입이 완료되었습니다.',
      },
    );
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center gap-6">
        <Image src={SoftwareLogo} alt="software" width={140} height={140} priority />
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-2xl font-medium tracking-tight">환영합니다!</h3>
          <p className="text-muted-foreground text-center text-sm">
            동아리 공용 공간 예약 시스템을 이용하기 위해 정보를 입력해주세요.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[300px] flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="이름을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="club"
            render={({ field }) => (
              <FormItem>
                <FormLabel>동아리</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="동아리를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(Club).map((club) => (
                      <SelectItem key={club} value={club}>
                        {clubName(club)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isApiProcessing} size="lg">
            시작하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
