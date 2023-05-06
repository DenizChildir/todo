import { createContext } from 'react';

const DraggedTaskContext = createContext({
    draggedTask: null,
    setDraggedTask: () => {},
});

export default DraggedTaskContext;
