import Image from 'next/image';

import { DialogHeader, DialogTitle } from '@/component/ui/dialog';

export interface ReturnPictureModalProps {
  image: string;
}

export default function ReturnPictureModal({ image }: ReturnPictureModalProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>반납 사진</DialogTitle>
      </DialogHeader>

      <Image
        src={image}
        alt="반납 사진"
        width={1000}
        height={1000}
        unoptimized
        className="rounded-md"
      />
    </>
  );
}
