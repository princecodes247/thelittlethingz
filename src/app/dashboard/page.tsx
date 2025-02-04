import Dashboard from "./dashboard";
import { getUserValentines } from "@/actions";

export default async function DashboardPage() {
  

  const data = await getUserValentines()
  return (
   <Dashboard data={data}/>
  );
}