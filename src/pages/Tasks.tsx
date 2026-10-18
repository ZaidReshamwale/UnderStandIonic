import { useRef, useState } from 'react';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
  useIonViewWillLeave
} from '@ionic/react';
import { add, chevronForward, trash } from 'ionicons/icons';
import { Task, useTasks } from '../data/tasks';
import './Tasks.css';
import AddTaskModal from '../components/AddTaskModal';

const Tasks: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const listRef = useRef<HTMLIonListElement>(null);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  // Pages stay mounted when you navigate away, so close any open swipe options on leave
  useIonViewWillLeave(() => {
    listRef.current?.closeSlidingItems();
  });

  const saveTask = (title: string, notes: string) => {
    addTask(title, notes);
    setIsAddOpen(false);
    presentToast({ message: 'Task added', duration: 1500, position: 'top', color: 'success' });
  };

  const confirmDelete = (task: Task) =>
    presentAlert({
      header: 'Delete task?',
      message: `"${task.title}" will be removed.`,
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: () => listRef.current?.closeSlidingItems() },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            deleteTask(task.id);
            presentToast({ message: 'Task deleted', duration: 1500, position: 'top' });
          }
        }
      ]
    });

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Tasks</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList inset ref={listRef}>
          <IonListHeader>
            <IonLabel>{remaining} remaining</IonLabel>
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
                <IonLabel className={task.done ? 'task-done' : ''}>
                  <h2>{task.title}</h2>
                  {task.notes && <p>{task.notes}</p>}
                </IonLabel>
                <IonButton
                  slot="end"
                  fill="clear"
                  color="medium"
                  routerLink={`/tasks/${task.id}`}
                  aria-label={`Open ${task.title}`}
                >
                  <IonIcon slot="icon-only" icon={chevronForward} />
                </IonButton>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => confirmDelete(task)}>
                  <IonIcon slot="icon-only" icon={trash} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}

          {tasks.length === 0 && (
            <IonItem lines="none">
              <IonNote>No tasks yet. Tap + to add one!</IonNote>
            </IonItem>
          )}
        </IonList>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setIsAddOpen(true)} aria-label="Add task">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <AddTaskModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={saveTask} />
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
