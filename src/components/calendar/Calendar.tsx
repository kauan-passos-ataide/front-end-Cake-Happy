'use client';
import { useEffect, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  parseISO,
} from 'date-fns';
import { Dialog, DialogTrigger, DialogContent } from '@radix-ui/react-dialog';
import { cn, formatCurrency } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';
import { CaretLeftIcon, CaretRightIcon } from '../icons/icons';
import { DialogClose, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useQuery } from '@tanstack/react-query';
import { SkeletonCalendar } from './SkeletonCalendar';
import privateApi from '@/services/privateApi';

type Order = {
  id: string;
  title: string;
  date: string;
  client: string;
  value: number;
};

const CalendarUI = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [orders, setOrders] = useState<Order[]>([]);

  const { isPending, isError, data } = useQuery({
    queryKey: ['orders', currentMonth],
    queryFn: async () => {
      return await getOrders();
    },
  });

  async function getOrders() {
    return await privateApi.post(`/order/get-orders-test`, {
      currentMonth,
    });
  }

  useEffect(() => {
    if (!data?.data.orders) return;
    setOrders(data.data.orders);
  }, [data]);

  if (isPending) return <SkeletonCalendar />;
  if (isError) {
    return;
  }

  // const orders: Order[] = [
  //   {
  //     id: '1',
  //     title: 'Pedido #001',
  //     date: '2025-07-02',
  //     client: 'João da Silva',
  //     value: 150.75,
  //   },
  //   {
  //     id: '2',
  //     title: 'Pedido #002',
  //     date: '2025-07-02',
  //     client: 'Maria Oliveira',
  //     value: 220.0,
  //   },
  //   {
  //     id: '5',
  //     title: 'Pedido #005',
  //     date: '2025-07-02',
  //     client: 'Maria Oliveira',
  //     value: 220.0,
  //   },
  //   {
  //     id: '7',
  //     title: 'Pedido #007',
  //     date: '2025-07-02',
  //     client: 'Maria Oliveira',
  //     value: 220.0,
  //   },
  //   {
  //     id: '10',
  //     title: 'Pedido #010',
  //     date: '2025-07-02',
  //     client: 'Maria Oliveira',
  //     value: 220.0,
  //   },
  //   {
  //     id: '9',
  //     title: 'Pedido #009',
  //     date: '2025-07-02',
  //     client: 'Maria Oliveira',
  //     value: 220.0,
  //   },
  //   {
  //     id: '3',
  //     title: 'Pedido #003',
  //     date: '2025-07-04',
  //     client: 'Carlos Santos',
  //     value: 80.5,
  //   },
  // ];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const ordersByDate = orders.reduce<Record<string, Order[]>>((acc, ev) => {
    const key = format(parseISO(ev.date), 'yyyy-MM-dd');
    acc[key] = acc[key] || [];
    acc[key].push(ev);
    return acc;
  }, {});

  const handlePrev = () => {
    setCurrentMonth((prev) => addDays(startOfMonth(prev), -1));
  };
  const handleNext = () => {
    setCurrentMonth((prev) => addDays(endOfMonth(prev), 1));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer text-cake-happy-dark"
        >
          <CaretLeftIcon />
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <button
          onClick={handleNext}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer text-cake-happy-dark"
        >
          <CaretRightIcon />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold bg-gray-50 py-2"
          >
            {day}
          </div>
        ))}

        {days.map((dayItem, idx) => {
          const key = format(dayItem, 'yyyy-MM-dd');
          const ordersOnDay = ordersByDate[key] || [];

          return (
            <Dialog key={idx}>
              <DialogTrigger
                className={cn(
                  'h-[120px] p-2 bg-white hover:bg-gray-100 cursor-pointer flex flex-col justify-between',
                  !isSameMonth(dayItem, currentMonth) &&
                    'text-gray-400 bg-gray-50',
                )}
              >
                <div className="text-sm font-medium">
                  {format(dayItem, 'd')}
                </div>
                {ordersOnDay.length > 0 && (
                  <div className="text-xs bg-yellow-100 text-yellow-800 rounded px-2 py-0.5 mt-auto line-clamp-2 text-ellipsis">
                    {ordersOnDay.length} pedido(s)
                  </div>
                )}
              </DialogTrigger>
              <DialogContent className="fixed inset-0 flex flex-col z-50 bg-black/50 justify-center items-center">
                <div className="flex flex-col justify-center items-start bg-white px-15 pb-20 pt-5 rounded-lg shadow">
                  <DialogHeader className="pb-10">
                    <DialogClose asChild>
                      <Button className="cursor-pointer bg-cake-happy-dark text-white hover:bg-cake-happy-dark/90">
                        Fechar
                      </Button>
                    </DialogClose>
                  </DialogHeader>
                  <DialogTitle className="text-lg font-semibold mb-2">
                    Pedidos em {format(dayItem, 'dd/MM/yyyy')}
                  </DialogTitle>
                  {ordersOnDay.map((ev, i) => (
                    <div key={i} className="p-2 border rounded mb-2 w-full">
                      <p className="text-sm font-medium">{ev.title}</p>
                      <p className="text-xs text-gray-600">
                        {formatCurrency(ev.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarUI;
