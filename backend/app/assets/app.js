/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';

document.addEventListener('DOMContentLoaded', () => {
   document.querySelectorAll('[data-trigger]').forEach(linkListener);
});

function linkListener(element) {
    
    element.addEventListener('click', (e) => {
        

        switch (element.dataset.trigger) {
           case 'delete-task':
              e.preventDefault();
              removeTask(e, element);
              break;
           case 'complete-task':
              toggleTaskStatus(e, element);
              break;
           case 'delete-user':
              e.preventDefault();
              removeUser(e, element);
              break;
           default:
              break;
        }
     });
}

function removeTask(e, element) {
    const id = element.dataset.id;
    const task = document.getElementById(`task-${id}`);
    if (confirm('Are you sure you want to delete this task?')) {
       
       const xhr = new XMLHttpRequest();
       xhr.open('DELETE', element.href);
       xhr.onload = function() {
           if (xhr.status === 200) {                    
               task.classList.add('task-removing');
               
               setTimeout(() => {
                   task.remove();
               }, 600);
           }
       };
       xhr.send();
       return false;
    }
}


function removeUser(e, element) {
    const id = element.dataset.id;
    const user = document.getElementById(`user-${id}`);
    if (confirm('Are you sure you want to delete this user?')) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', element.href);
        xhr.onload = function() {
            if (xhr.status === 200) {                    
                user.classList.add('user-removing');
                
                setTimeout(() => {
                    user.remove();
                }, 600);
            }
        };
        xhr.send();
        return false;
    }
}

function toggleTaskStatus(e, element) {
    const id = element.dataset.id;
    const task = document.getElementById(`task-${id}`);
    const xhr = new XMLHttpRequest();

    xhr.open('POST', element.dataset.href);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Get the new status from the checkbox
            const isCompleted = element.checked;
            
            // Find and update the status badge using the new class
            const statusBadge = task.querySelector('.status-badge');
            const titleElement = task.querySelector('.title');

            if (statusBadge) {
                if (isCompleted) {
                    statusBadge.className = 'px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full status-badge';
                    statusBadge.textContent = 'Completed';
                    titleElement.classList.add('line-through');
                } else {
                    statusBadge.className = 'px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full status-badge';
                    statusBadge.textContent = 'Pending';
                    titleElement.classList.remove('line-through');
                }
            }
        } else {
            // Revert checkbox if request failed
            element.checked = !element.checked;
        }
    };
    xhr.send(JSON.stringify({ completed: element.checked }));
}