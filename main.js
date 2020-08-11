class Model {
	constructor() {
		this.notepad = [
			{
				id: 0,
				createdOn: 1597107631211,
				text:
					'When action grows unprofitable, gather information; when information grows unprofitable, sleep.',
			},
			{
				id: 1,
				creadedOn: 1597107648381,
				text:
					'A city where people shine brighter than the neon lights, are more violent than the weapons they carry ' +
					'and hope for a better tomorrow harder than anywhere else.',
			},
		];
	}

	addNote() {
		const note = {
			id: this.notepad.length - 1,
			createdOn: Date.now(),
			text: ' ',
		};
		this.notepad.push(note);

		this.onNotepadChanged(this.notepad);
	}

	deleteNote(id) {
		this.notepad = this.notepad.filter((note) => note.id != id);

		this.onNotepadChanged(this.notepad);
	}

	editNote(id, text) {
		this.notepad = this.notepad.map((note) => {
			note.id === id
				? { id: note.id, createdOn: note.creadedOn, text: text }
				: note;
		});
	}

	bindNotepadChanged(callback) {
		this.onNotepadChanged = callback;
	}
}

class View {
	constructor() {
		this.app = document.getElementById('root');

		this.title = this.createElement('h1');
		this.title.innerText = 'Notes';

		this.addNoteButton = this.createElement('i');
		this.addNoteButton.className = 'fas fa-plus';

		this.notepad = this.createElement('ul');

		this.app.append(this.title, this.addNoteButton, this.notepad);
	}

	displayNotepad(notepad) {
		while (this.notepad.firstChild) {
			this.notepad.removeChild(this.notepad.firstChild);
		}

		if (notepad.length === 0) {
			const p = this.createElement('p');
			p.textContent = "Wow much emptiness, why don't you add a note!";
			this.notepad.append(p);
		} else {
			notepad.forEach((note) => {
				const li = this.createElement('li');
				li.id = note.id;

				const span = this.createElement('span');
				span.contentEditable = true;
				span.textContent = note.text;

				const deleteButton = this.createElement('button', 'delete');
				deleteButton.textContent = 'Delete';
				li.append(span, deleteButton);

				this.notepad.append(li);
			});
		}
	}

	bindAddNote(handler) {
		this.addNoteButton.addEventListener('click', (event) => {
			handler();
		});
	}

	bindDeleteNote(handler) {
		this.notepad.addEventListener('click', (event) => {
			if (event.target.className === 'delete') {
				const id = parseInt(event.target.parentElement.id);

				handler(id);
			}
		});
	}

	createElement(tag, className) {
		const element = document.createElement(tag);
		if (className) element.classList.add(className);

		return element;
	}
}

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;

		this.view.bindAddNote(this.handleAddNote);
		this.view.bindDeleteNote(this.handleDeleteNote);
		// this.view.bindEditNote(this.handleEditNote)

		this.model.bindNotepadChanged(this.onNotepadChanged);
		this.onNotepadChanged(this.model.notepad);
	}

	onNotepadChanged = (notepad) => {
		this.view.displayNotepad(notepad);
	};

	handleAddNote = () => {
		this.model.addNote();
	};

	handleDeleteNote = (id) => {
		this.model.deleteNote(id);
	};

	handleEditNote = (id, text) => {
		this.model.editNote(id, text);
	};
}

const app = new Controller(new Model(), new View());
