'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PromotionsRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/admin/properties/promote');
  }, [router]);

  return null;
}