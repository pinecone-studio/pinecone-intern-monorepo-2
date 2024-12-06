'use client';

import { SearchResult } from '@/components/search-hotel/SearchResult';

const Page = () => {
  return (
    <>
      <section className="h-screen">
        <h2>Home Page</h2>
        <SearchResult />
      </section>
    </>
  );
};

export default Page;
