import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { useState } from "react";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, notes: string) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({isOpen, onClose, onSave}) =>  {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');

    const save = () =>{
        if(!title.trim()) return;
        onSave(title.trim(), notes.trim());
    }

    const reset = () =>{
        setTitle('');
        setNotes('');
        onClose();
    }

    return(
        <IonModal isOpen={isOpen} onDidDismiss={reset}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onClose}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Add Task</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong onClick={save} disabled={!title.trim()}>Save</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
        
        <IonContent className="ion-padding">
            <IonList inset>
                <IonItem>
                    <IonInput 
                    label="Title"
                    labelPlacement="stacked"
                    placeholder="What do you want to do?"
                    value={title} 
                    onIonInput={(e) => setTitle(e.detail.value ?? '')}
                    onKeyDown={(e) => e.key === 'Enter' && save()}
                    required />
                </IonItem>
                <IonItem>
                    <IonTextarea
                    label="Notes"
                    labelPlacement="stacked"
                    placeholder="Additional details (optional)"
                    autoGrow
                    value={notes} 
                    onIonInput={(e) => setNotes(e.detail.value ?? '')}
                    />
                </IonItem>
            </IonList>
        </IonContent>

        </IonModal>
    )
}

export default AddTaskModal;