import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SortableItem } from './SortableItem';
import { useDroppable } from '@dnd-kit/core';
import { KanbanColumnType, Order } from './KanbanBoardUi';
import { TrashIcon } from '../icons/icons';

interface Props {
  column: KanbanColumnType;
  orders: Order[];
  isEditable?: boolean;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  isTarget?: boolean;
}

export function KanbanColumn({
  column,
  orders,
  isEditable,
  onRename,
  onRemove,
  isTarget,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.name);
  const [visibleCount, setVisibleCount] = useState(20);

  const handleRename = () => {
    onRename(column.id, title);
    setEditing(false);
  };

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white shadow rounded w-64 select-none min-h-full flex flex-col p-2 transition-all duration-200 border-2 ${
        isTarget ? 'border-cake-happy-dark' : 'border-transparent'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        {editing && isEditable ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            autoFocus
          />
        ) : (
          <h2
            className="font-bold text-sm cursor-pointer"
            onClick={() => isEditable && setEditing(true)}
          >
            {column.name}
          </h2>
        )}

        {isEditable && (
          <div
            onClick={() => onRemove(column.id)}
            className="text-red-500 cursor-pointer hover:text-red-600"
          >
            <TrashIcon />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {orders.slice(0, visibleCount).map((order) => (
          <SortableItem key={order.id} order={order} />
        ))}

        {orders.length > visibleCount && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 20)}
            className="text-sm text-blue-600 mt-2"
          >
            Carregar mais
          </button>
        )}
      </div>
    </div>
  );
}
