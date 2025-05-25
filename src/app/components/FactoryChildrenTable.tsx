import { format } from 'date-fns';
import type { Factory } from '@/types/factory';

type FactoryChildrenTableProps = {
  childrenList: NonNullable<Factory['children']>;
};

/**
 * Renders a list of children for a factory.
 * Shows an empty state if there are no children.
 */
export default function FactoryChildrenTable({ childrenList }: FactoryChildrenTableProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Children</h2>
      {childrenList.length === 0 ? (
        <div className="text-gray-500">No children.</div>
      ) : (
        <ul className="divide-y divide-gray-200" aria-label="Children list">
          {childrenList.map((child) => (
            <li key={child.id} className="py-2 flex justify-between">
              <span>Value: {child.value}</span>
              <span className="text-gray-500 text-sm">
                {format(new Date(child.created_at), 'yyyy-MM-dd HH:mm:ss')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
