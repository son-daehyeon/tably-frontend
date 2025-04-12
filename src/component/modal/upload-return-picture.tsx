import { ChangeEvent, useCallback, useRef, useState } from 'react';

import Image from 'next/image';

import { Button } from '@/component/ui/button';
import { DialogHeader, DialogTitle } from '@/component/ui/dialog';

import Api from '@/api';
import { ReservationDto } from '@/api/types/reservation';

import { useModalStore } from '@/store/modal.store';

import { useApiWithToast } from '@/hook/use-api';

import { ImagePlus } from 'lucide-react';

export interface UploadReturnPictureModalProps {
  reservation: ReservationDto;
  onReturn: (reservation: ReservationDto) => void;
}

export default function UploadReturnPictureModal({
  reservation,
  onReturn,
}: UploadReturnPictureModalProps) {
  const { close } = useModalStore();

  const imgRef = useRef<HTMLInputElement>(null);

  const [isApiProcessing, startApi] = useApiWithToast();

  const [file, setFile] = useState<File>();

  const uploadFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }, []);

  const returnReservation = useCallback((reservation: ReservationDto, file: File) => {
    startApi(
      async () => {
        const { reservation: _reservation } = await Api.Domain.Reservation.returnReservation(
          reservation.id,
          file,
        );
        onReturn(_reservation);
      },
      {
        loading: '반납 사진을 업로드하고 있습니다.',
        success: '반납이 완료되었습니다.',
        finally: close,
      },
    );
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>반납 사진 업로드</DialogTitle>
      </DialogHeader>

      <div>
        <div
          className="flex h-40 cursor-pointer items-center justify-center rounded-md border border-dashed hover:bg-neutral-50"
          onClick={() => imgRef.current?.click()}
        >
          {file ? (
            <Image
              src={URL.createObjectURL(file)}
              alt="업로드된 이미지"
              width={1000}
              height={1000}
              unoptimized
              className="h-40 w-auto object-contain"
            />
          ) : (
            <div className="flex items-center gap-2">
              <ImagePlus />
              <span className="text-sm">반납 사진을 올려주세요.</span>
            </div>
          )}
        </div>
      </div>

      <Button
        disabled={!file || isApiProcessing}
        onClick={() => returnReservation(reservation, file!)}
      >
        반납하기
      </Button>

      <input
        ref={imgRef}
        disabled={isApiProcessing}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={uploadFile}
      />
    </>
  );
}
