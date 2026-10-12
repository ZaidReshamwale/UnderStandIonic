import { IonButton, IonCheckbox, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonListHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { useState } from 'react';
import { add, trash } from 'ionicons/icons';

interface Task {
  id: number;
  title: string;
  done: boolean;
}
const Session1: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1, title: 'npm i -g @ionic/cli', done: true,
    },
    {
      id: 2, title: 'Create a new Ionic app', done: false,
    }
  ]);

  const [newTitle, setNewTitle] = useState('');

  const addTask = () => {
    const title = newTitle.trim();
    if (!title) return;
    setTasks([...tasks, { id: Date.now(), title, done: false }]);
    setNewTitle('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const remaining = tasks.filter(task => !task.done).length;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Session 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Session 1</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonItem>
          <IonInput
            label="New Task"
            labelPlacement="floating"
            placeholder="Enter a new task"
            value={newTitle}
            onIonInput={(e) => setNewTitle(e.detail.value ?? '')}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
        </IonItem>

        <IonButton slot="end" onClick={addTask} disabled={!newTitle.trim()}>
          <IonIcon slot="icon-only" icon={add} />
        </IonButton>

        <IonList inset>
          <IonListHeader>
            <IonLabel>{remaining} tasks remaining</IonLabel>
          </IonListHeader>

          {tasks.map((task) => (
            <IonItemSliding key={task.id}>
              <IonItem>
                <IonCheckbox
                  slot="start"
                  aria-label={task.title}
                  checked={task.done}
                  onIonChange={() => toggleTask(task.id)}
                />
                <IonLabel className={task.done ? 'task-done' : ''}>{task.title}</IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => deleteTask(task.id)}>
                  <IonIcon slot="icon-only" icon={trash} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}

          
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Session1;
