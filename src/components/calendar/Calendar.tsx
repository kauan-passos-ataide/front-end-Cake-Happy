// components/Calendar.tsx
'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBr from '@fullcalendar/core/locales/pt-br';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Pedido = {
  id: string;
  title: string;
  date: string;
  extendedProps: {
    cliente: string;
    valor: number;
  };
};

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const pedidos: Pedido[] = [
    {
      id: '1',
      title: 'Pedido #001',
      date: '2025-07-02',
      extendedProps: {
        cliente: 'João da Silva',
        valor: 150.75,
      },
    },
    {
      id: '2',
      title: 'Pedido #002',
      date: '2025-07-02',
      extendedProps: {
        cliente: 'Maria Oliveira',
        valor: 220.0,
      },
    },
    {
      id: '5',
      title: 'Pedido #005',
      date: '2025-07-02',
      extendedProps: {
        cliente: 'Maria Oliveira',
        valor: 220.0,
      },
    },
    {
      id: '7',
      title: 'Pedido #007',
      date: '2025-07-02',
      extendedProps: {
        cliente: 'Maria Oliveira',
        valor: 220.0,
      },
    },
    {
      id: '10',
      title: 'Pedido #010',
      date: '2025-07-02',
      extendedProps: {
        cliente: 'Maria Oliveira',
        valor: 220.0,
      },
    },
    {
      id: '9',
      title: 'Pedido #009',
      date: '2025-07-03',
      extendedProps: {
        cliente: 'Maria Oliveira',
        valor: 220.0,
      },
    },
    {
      id: '3',
      title: 'Pedido #003',
      date: '2025-07-04',
      extendedProps: {
        cliente: 'Carlos Santos',
        valor: 80.5,
      },
    },
  ];

  return (
    <div className="p-6">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={pedidos}
        locale={ptBr}
        eventClick={(info: EventClickArg) => {
          setSelectedEvent(info.event);
          setIsOpen(true);
        }}
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: '',
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
        }}
        height="auto"
        eventContent={(arg) => (
          <div className="bg-cake-happy-dark cursor-pointer text-white text-xs px-1 py-0.5 rounded">
            {arg.event.title}
          </div>
        )}
        dayCellContent={(arg) => {
          const today = arg.date.toDateString() === new Date().toDateString();
          return (
            <span
              className={`text-xs pr-1 text-center ${today ? 'text-white bg-cake-happy-dark rounded-full font-semibold px-1' : 'text-gray-500'}`}
            >
              {arg.dayNumberText}
            </span>
          );
        }}
        dayCellClassNames={(arg) => {
          const today = new Date().toDateString();
          const isToday = arg.date.toDateString() === today;

          return isToday
            ? [
                '!bg-cake-happy-clean/30',
                '!border',
                '!border-cake-happy-dark',
                'rounded-md',
              ]
            : [];
        }}
        dayMaxEventRows={5}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Cliente:</strong>{' '}
                {selectedEvent.extendedProps['cliente']}
              </p>
              <p>
                <strong>Valor:</strong> R${' '}
                {selectedEvent.extendedProps['valor'].toFixed(2)}
              </p>
              <p>
                <strong>Data:</strong>{' '}
                {selectedEvent.start?.toLocaleDateString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
