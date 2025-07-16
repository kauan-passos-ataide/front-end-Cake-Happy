import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Order } from './KanbanBoardUi';

type Props = {
  order: Order;
};

export const SortableItem = ({ order }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: order.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-100 rounded p-2 shadow text-sm select-none cursor-grab"
    >
      <p className="font-semibold mb-1">{order.title}</p>
      <p className="text-xs text-gray-500">{order.client}</p>
      <p className="text-xs text-gray-500">{order.date}</p>
      <p className="text-xs text-gray-700 font-medium">
        R$ {order.value.toFixed(2)}
      </p>
    </div>
  );
};
