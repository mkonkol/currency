import { LIST, LIST_NAME } from "./variables.js";
import { updateAfterChangePosition } from "./localStorage.js";

export const activateDragNDrop = elementList => {
    elementList.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
        draggable.addEventListener('dragover', e => {
            e.preventDefault(); 
            const afterElement = getDragAfterElement(e.clientY);
            const draggable = document.querySelector('.dragging');
            
            if (afterElement !== null) {
                LIST.insertBefore(draggable, afterElement);
            }
        });
        draggable.addEventListener('drop', e => {
            e.preventDefault();
            updateAfterChangePosition(LIST_NAME, [...LIST.children]);
        });
    });
}

export const getDragAfterElement = yPos => {
    const draggableElements = [...LIST.querySelectorAll('.favourite-list__item:not(.dragging)')];
    
    return draggableElements.reduce((closets, child) => {
        const box = child.getBoundingClientRect();
        const offset = yPos - box.top - box.height / 2;
        
        if (offset < 0 && offset > closets.offset) {
            return { offset: offset, element: child };
        } else {
            return closets;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
