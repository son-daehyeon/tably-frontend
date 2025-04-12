import { Info } from '@/app/auth/login/_constant/info';

interface InfoCardProps {
  info: Info;
}

export default function InfoCard({ info }: InfoCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-gray-50 p-4 text-center">
      <div className="font-medium">{info.title}</div>
      <div className="text-sm text-gray-600">{info.description}</div>
    </div>
  );
}
