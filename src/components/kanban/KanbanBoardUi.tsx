'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  rectIntersection,
  DragOverlay,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { v4 as uuid } from 'uuid';
import { KanbanColumn } from './KanbanColumn';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export type Order = {
  id: string;
  title: string;
  date: string;
  client: string;
  value: number;
};

export type KanbanColumnType = {
  id: string;
  name: string;
  isFixed?: boolean;
  orderIds: string[];
};

export type KanbanState = {
  columns: KanbanColumnType[];
  orders: Record<string, Order>;
};

const initialOrders: Record<string, Order> = {
  '1': {
    id: '1',
    title: 'Pedido #001',
    date: '2025-07-02',
    client: 'João da Silva',
    value: 150.75,
  },
  '2': {
    id: '2',
    title: 'Pedido #002',
    date: '2025-07-03',
    client: 'Maria Oliveira',
    value: 220,
  },
  '3': {
    id: '3',
    title: 'Pedido #003',
    date: '2025-07-04',
    client: 'Carlos Santos',
    value: 80.5,
  },
};

const initialColumns: KanbanColumnType[] = [
  {
    id: 'pending-approval',
    name: 'Pendentes de aprovação',
    isFixed: true,
    orderIds: ['1'],
  },
  {
    id: 'pending',
    name: 'Pendentes',
    isFixed: true,
    orderIds: ['2'],
  },
  {
    id: 'in-progress',
    name: 'Em execução',
    orderIds: ['3'],
  },
];

export default function KanbanBoard() {
  const [state, setState] = useState<KanbanState>({
    columns: initialColumns,
    orders: initialOrders,
  });
  const [newColumnName, setNewColumnName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id.toString();
    const order = state.orders[id];
    if (order) {
      setActiveOrder(order);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setActiveColumnId(null);
      return;
    }

    const overId = over.id.toString();

    const overColumn = state.columns.find(
      (col) => col.id === overId || col.orderIds.includes(overId),
    );

    if (overColumn) {
      setActiveColumnId(overColumn.id);
    } else {
      setActiveColumnId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOrder(null);
    setActiveColumnId(null);

    if (!over || !over.id || active.id === over.id) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const sourceColumn = state.columns.find((col) =>
      col.orderIds.includes(activeId),
    );

    let targetColumn = state.columns.find((col) =>
      col.orderIds.includes(overId),
    );

    if (!targetColumn) {
      targetColumn = state.columns.find((col) => col.id === overId);
    }

    if (!sourceColumn || !targetColumn) return;

    if (
      sourceColumn.id === 'pending-approval' ||
      targetColumn.id === 'pending-approval'
    ) {
      return;
    }

    if (sourceColumn.id === targetColumn.id) {
      const order = [...sourceColumn.orderIds];
      const oldIndex = order.indexOf(activeId);
      const newIndex = order.indexOf(overId);

      if (newIndex === -1) return;

      order.splice(oldIndex, 1);
      order.splice(newIndex, 0, activeId);

      const updatedColumns = state.columns.map((col) =>
        col.id === sourceColumn.id ? { ...col, orderIds: order } : col,
      );

      setState((prev) => ({ ...prev, columns: updatedColumns }));
    } else {
      const updatedColumns = state.columns.map((col) => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            orderIds: col.orderIds.filter((id) => id !== activeId),
          };
        }
        if (col.id === targetColumn!.id) {
          const newOrderIds = [...col.orderIds];
          const index = col.orderIds.indexOf(overId);
          const insertAt = index === -1 ? col.orderIds.length : index;
          newOrderIds.splice(insertAt, 0, activeId);
          return {
            ...col,
            orderIds: newOrderIds,
          };
        }
        return col;
      });

      setState((prev) => ({ ...prev, columns: updatedColumns }));
    }
  };

  const confirmAddColumn = () => {
    if (!newColumnName.trim()) return;

    const newCol: KanbanColumnType = {
      id: uuid(),
      name: newColumnName.trim(),
      orderIds: [],
    };

    setState((prev) => ({
      ...prev,
      columns: [...prev.columns, newCol],
    }));

    setNewColumnName('');
    setDialogOpen(false);
  };

  const renameColumn = (columnId: string, newName: string) => {
    setState((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, name: newName } : col,
      ),
    }));
  };

  const removeColumn = (columnId: string) => {
    const column = state.columns.find((col) => col.id === columnId);
    if (column?.isFixed) return;

    setState((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
    }));
  };

  return (
    <div className="flex w-full overflow-x-auto h-full">
      <div className="flex w-fit gap-4 p-4">
        <DndContext
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          {state.columns.map((column) => (
            <SortableContext
              key={column.id}
              items={column.orderIds}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                column={column}
                orders={column.orderIds.map((id) => state.orders[id])}
                onRename={renameColumn}
                onRemove={removeColumn}
                isEditable={!column.isFixed}
                isTarget={activeColumnId === column.id}
              />
            </SortableContext>
          ))}

          <DragOverlay>
            {activeOrder && (
              <div className="bg-gray-200 rounded p-2 shadow text-sm select-none cursor-grabbing w-60">
                <p className="font-semibold mb-1">{activeOrder.title}</p>
                <p className="text-xs text-gray-500">{activeOrder.client}</p>
                <p className="text-xs text-gray-500">{activeOrder.date}</p>
                <p className="text-xs text-gray-700 font-medium">
                  R$ {activeOrder.value.toFixed(2)}
                </p>
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-gray-200 rounded px-2 py-1 w-[200px] h-fit font-semibold cursor-pointer">
              Adicionar Coluna
            </button>
          </DialogTrigger>
          <DialogContent className="flex flex-col gap-2 items-start">
            <DialogTitle>Insira o nome da nova coluna:</DialogTitle>
            <Input
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Nome da nova coluna"
            />
            <Button
              onClick={confirmAddColumn}
              className="bg-cake-happy-dark cursor-pointer hover:bg-cake-happy-dark/90"
            >
              Confirmar
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
