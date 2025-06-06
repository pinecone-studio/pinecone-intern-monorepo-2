import * as React from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Status = () => {
  return (
    <Select>
      <SelectTrigger className="w-28 h-8">
        <SelectValue placeholder="Төлөв" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="ready">Бэлэн</SelectItem>
          <SelectItem value="waiting">Хүлээгдэж буй</SelectItem>
          <SelectItem value="in process">Хийгдэж буй</SelectItem>
          <SelectItem value="finished">Дууссан</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
