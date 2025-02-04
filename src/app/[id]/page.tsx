import { getValentine } from "@/actions";
import ValentineView from "./valentine-view";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ValentinePage({ params }: Props) {
  const result = await getValentine((await params).id);

  if (!result.success) {
    redirect('/');
  }

  return (
    <ValentineView valentine={result.data} />
  );
}
