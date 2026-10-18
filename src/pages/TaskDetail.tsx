import { useParams } from 'react-router-dom';
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonPage,
    IonText,
    IonTextarea,
    IonTitle,
    IonToggle,
    IonToolbar,
    useIonAlert,
    useIonRouter,
    useIonToast
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import { useTasks } from '../data/tasks';

const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { tasks, updateTask, deleteTask } = useTasks();
    const router = useIonRouter();
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();

    const task = tasks.find((t) => t.id === Number(id));

    const confirmDelete = () => {
        if (!task) return;
        presentAlert({
            header: 'Delete task?',
            message: `"${task.title}" will be removed.`,
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        router.goBack();
                        deleteTask(task.id);
                        presentToast({ message: 'Task deleted', duration: 1500, position: 'top' });
                    }
                }
            ]
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/tasks" />
                    </IonButtons>
                    <IonTitle>Task</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {task ? (
                    <>
                        <IonList inset>
                            <IonItem>
                                <IonInput
                                    label="Title"
                                    labelPlacement="stacked"
                                    value={task.title}
                                    onIonInput={(e) => updateTask(task.id, { title: e.detail.value ?? '' })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonTextarea
                                    label="Notes"
                                    labelPlacement="stacked"
                                    placeholder="Add some details"
                                    autoGrow
                                    value={task.notes}
                                    onIonInput={(e) => updateTask(task.id, { notes: e.detail.value ?? '' })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonToggle
                                    checked={task.done}
                                    onIonChange={(e) => updateTask(task.id, { done: e.detail.checked })}
                                >
                                    Completed
                                </IonToggle>
                            </IonItem>
                        </IonList>

                        <div className="ion-padding">
                            <IonButton expand="block" color="danger" fill="outline" onClick={confirmDelete}>
                                <IonIcon slot="start" icon={trash} />
                                Delete task
                            </IonButton>
                        </div>
                    </>
                ) : (
                    <IonText color="medium">
                        <p className="ion-padding ion-text-center">Task not found.</p>
                    </IonText>
                )}
            </IonContent>
        </IonPage>
    );
};

export default TaskDetail;
