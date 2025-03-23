/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';

document.addEventListener('DOMContentLoaded', () => {
   document.querySelectorAll('[data-trigger]').forEach(element => {
      element.addEventListener('click', (e) => {
         e.preventDefault();
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
      });
   });
});

