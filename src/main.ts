import './style.css'
import { v4 as uuid } from 'uuid';

export interface Todo {
    state: 'done' | 'ongoing';
    text: string;
    id: string;
}

const debugText = document.createElement('p');
// renderDebugText();

// updateCounter();

function updateCounter() {
    const counterText = `${appState.todos.filter(({ state }) => state === 'done').length}/${appState.todos.length}`;
    const counterSpan: HTMLSpanElement = document.querySelector('.counter')!;
    counterSpan.innerText = counterText;
}

class AppState {
    private _todos: Todo[] = [];
    get todos() { return this._todos; }
    set todos(v: Todo[]) {
        this._todos = v;
        this.renderDebugText();
        this.updateCounter();
    }

    constructor(todos: Todo[]) {
        this.todos = todos;
    }

    renderDebugText() {
        debugText.innerHTML = JSON.stringify(this.todos);
        document.body.appendChild(debugText);
    }

    updateCounter() {
        const counterText = `${this.todos.filter(({ state }) => state === 'done').length}/${this.todos.length}`;
        const counterSpan: HTMLSpanElement = document.querySelector('.counter')!;
        counterSpan.innerText = counterText;
    }
    
}

let appState = new AppState([
    { id: '1', text: 'git add .', state: 'done' },
    { id: '2', text: 'git commit', state: 'ongoing' },
    { id: '3', text: 'git push', state: 'ongoing' },
    { id: '4', text: 'escape building', state: 'ongoing' },
]);

appState.todos.forEach(todo => {
    const li = createTodoElement(todo);
    document.querySelector('ul')?.appendChild(li);
})


function renderDebugText() {
    debugText.innerHTML = JSON.stringify(appState.todos);
    document.body.appendChild(debugText);
    updateCounter();
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
                id: uuid(),
            }
            const li = createTodoElement(todo);
            document.querySelector('ul')?.appendChild(li);
            addTextbox.value = '';
            appState.todos = [...appState.todos, todo];
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
        appState.todos = appState.todos.filter((t) => t.id !== id);
        renderDebugText();
    })

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox?.addEventListener('change', () => {
        li.querySelector('span')?.classList.toggle('done');
        const t = appState.todos.find((t) => t.id === id);
        if (!!t) {
            t.state = t.state === 'done' ? 'ongoing' : 'done';
            renderDebugText();
        }
    }
    )

    const input: HTMLInputElement = li.querySelector('input[type="text"]')!
    const span = li.querySelector('span')!;
    const div = li.querySelector('.todo-item>div')!;

    span.addEventListener('dblclick', () => {
        input.classList.remove('hidden');
        div.classList.add('hidden');
        input.value = span.innerText;
    })

    input.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key === 'Enter' && input.value !== '') {
            div.classList.toggle('hidden');
            input.classList.toggle('hidden');
            span.innerText = input.value;
            appState.todos = appState.todos.map((t) => t.id === id
                ? { ...t, text: input.value }
                : t);
            renderDebugText();
        }
    })



    return li;
}


