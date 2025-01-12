'use server'

import { LeaveCalendar } from "@/components/leaveCalendar/LeaveCalendar";
import { SecureWrapper } from "@/context/SecurePageWrapper";

const Page = () => {
  return <SecureWrapper roles={['admin', 'supervisee', 'supervisor']}>
    <LeaveCalendar/>
  </SecureWrapper>;
};

export default Page;
