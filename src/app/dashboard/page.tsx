import { isAuth } from "@/middleware/auth";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Dashboard from "./dashboard";
import { getUserValentines } from "@/actions";

export default async function DashboardPage() {
  
  const authData = await isAuth();
  const data = await getUserValentines(authData?.session?.userId);
  return (
   <Dashboard data={data}/>
  );
}