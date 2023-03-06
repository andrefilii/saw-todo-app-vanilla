import './style.css'

export interface Todo {
    state: 'done' | 'ongoing';
    text: string;
    id: string;
}

let todos: Todo[] = [
    { id: '1', text: 'git add .', state: 'done' },
    { id: '2', text: 'git commit', state: 'ongoing' },
    { id: '3', text: 'git push', state: 'ongoing' },
    { id: '4', text: 'escape building', state: 'ongoing' },
]
const debugText = document.createElement('p');
renderDebugText();

todos.forEach(todo => {
    const li = createTodoElement(todo);
    document.querySelector('ul')?.appendChild(li);
})

const completed = (tds: Todo[]) => {
    return tds.filter(({ state }) => state === 'done').length
}

function renderDebugText() {
    debugText.innerHTML = JSON.stringify(todos);
    document.body.appendChild(debugText);
}

const addTextbox = document.querySelector('input');
addTextbox?.addEventListener(
    'keyup',
    (e: KeyboardEvent) => {
        const text = addTextbox.value;
        if (e.key === 'Enter' && text !== '') {
            const todo: Todo = {
                state: 'ongoing',
                text,
                id: '1',
            }
            const li = createTodoElement(todo);
            document.querySelector('ul')?.appendChild(li);
            addTextbox.value = '';
            todos = [...todos, todo];
            renderDebugText();
        }
    }
);



function createTodoElement({ id, text, state }: Todo) {
    const li = document.createElement('li');
    li.setAttribute('id', id);
    const done = state === 'done';
    li.innerHTML = `
        <div class="todo-item">
            <div>
                <input type="checkbox" ${done ? 'checked' : ''}>
                <span ${done ? 'class="done"' : ''}>${text}</span>
                <button>&times;</button>
            </div>
            <input class="hidden" type="text">
        </div>`;

    li.querySelector('button')?.addEventListener('click', () => {
        li.parentElement?.removeChild(li);
        // TODO: remove todo from todos
    })

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox?.addEventListener(
        'change',
        () => {
            li.querySelector('span')?.classList.toggle('done');
            const t = todos.find((t) => t.id === id);
            if (!!t) {
                t.state = t.state === 'done' ? 'ongoing' : 'done';
                renderDebugText();
            }
        }
    )

    return li;
}


