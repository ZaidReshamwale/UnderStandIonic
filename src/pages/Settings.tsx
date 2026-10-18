import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonList, IonListHeader, IonLabel, IonItem, IonSegment, IonSegmentButton, IonNote, useIonAlert, useIonToast } from "@ionic/react";
import { listOutline, checkmarkDoneOutline, timeOutline, sunnyOutline, moonOutline, phonePortraitOutline, trashOutline, informationCircleOutline, codeSlashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useTasks } from "../data/tasks";
import './Settings.css'

type ThemeMode = 'light' | 'dark' | 'system';

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const progressMessage = (total: number, percent: number) => {
    if (total === 0) return "You haven't added any tasks yet.";
    if (percent === 100) return "All tasks completed! Great job!";
    if (percent >= 50) return "You're more than halfway there!";
    return `You have completed ${percent}% of your tasks.`;
}

const Settings = () => {

    const [themeMode, setThemeMode] = useState<ThemeMode>('system');
    const { tasks, deleteTask } = useTasks();
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const apply = () =>
            document.documentElement.classList.toggle(
                'ion-palette-dark',
                themeMode === 'dark' || (themeMode === 'system' && media.matches)
            );

        apply();
        if (themeMode === 'system') return;
        media.addEventListener('change', apply);
        return () => media.removeEventListener('change', apply);
    }, [themeMode]);

    const completed = tasks.filter((t) => t.done).length;
    const remaining = tasks.length - completed;
    const percent = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

    const confirmClearCompleted = () => {
        presentAlert({
            header: 'Clear completed tasks?',
            message: `This will delete ${completed} completed task${completed === 1 ? '' : 's'}.`,
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Clear',
                    role: "destructive",
                    handler: () => {
                        tasks.filter((t) => t.done).forEach((t) => deleteTask(t.id));
                        presentToast({
                            message: 'Completed tasks cleared',
                            duration: 2000,
                            position: 'bottom'
                        })
                    }
                }
            ]
        })
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <section className="progress-card">
                    <div className="progress-ring">
                        <svg viewBox="0 0 120 120" aria-hidden="true">
                            <circle className="progress-ring-track" cx="60" cy="60" r={RING_RADIUS} />
                            <circle
                                className="progress-ring-value"
                                cx="60"
                                cy="60"
                                r={RING_RADIUS}
                                strokeDasharray={RING_CIRCUMFERENCE}
                                strokeDashoffset={RING_CIRCUMFERENCE * (1 - percent / 100)}
                            />
                        </svg>
                        <div className="progress-ring-label">
                            <span className="progress-ring-percent">{percent}%</span>
                            <span className="progress-ring-caption">done</span>
                        </div>
                    </div>
                    <div className="progress-text">
                        <h2>Your progress</h2>
                        <p>{progressMessage(tasks.length, percent)}</p>
                    </div>
                </section>

                <div className="stat-grid">
                    <div className="stat-tile">
                        <IonIcon icon={listOutline} color="primary" />
                        <span className="stat-value">{tasks.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-tile">
                        <IonIcon icon={checkmarkDoneOutline} color="success" />
                        <span className="stat-value">{completed}</span>
                        <span className="stat-label">Done</span>
                    </div>
                    <div className="stat-tile">
                        <IonIcon icon={timeOutline} color="warning" />
                        <span className="stat-value">{remaining}</span>
                        <span className="stat-label">Left</span>
                    </div>
                </div>

                <IonList inset>
                    <IonListHeader>
                        <IonLabel>Appearance</IonLabel>
                    </IonListHeader>
                    <IonItem lines="none">
                        <IonSegment
                            value={themeMode}
                            onIonChange={(e) => setThemeMode(e.detail.value as ThemeMode)}
                        >
                            <IonSegmentButton value="light">
                                <IonIcon icon={sunnyOutline} />
                                <IonLabel>Light</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="dark">
                                <IonIcon icon={moonOutline} />
                                <IonLabel>Dark</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="system">
                                <IonIcon icon={phonePortraitOutline} />
                                <IonLabel>System</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonItem>
                </IonList>

                <IonList inset>
                    <IonListHeader>
                        <IonLabel>Data</IonLabel>
                    </IonListHeader>
                    <IonItem button detail={false} disabled={completed === 0} onClick={confirmClearCompleted}>
                        <div slot="start" className="settings-icon settings-icon-danger">
                            <IonIcon icon={trashOutline} />
                        </div>
                        <IonLabel color="danger">Clear completed tasks</IonLabel>
                        <IonNote slot="end">{completed}</IonNote>
                    </IonItem>
                </IonList>

                <IonList inset>
                    <IonListHeader>
                        <IonLabel>About</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <div slot="start" className="settings-icon settings-icon-primary">
                            <IonIcon icon={informationCircleOutline} />
                        </div>
                        <IonLabel>Version</IonLabel>
                        <IonNote slot="end">0.0.1</IonNote>
                    </IonItem>
                    <IonItem>
                        <div slot="start" className="settings-icon settings-icon-tertiary">
                            <IonIcon icon={codeSlashOutline} />
                        </div>
                        <IonLabel>Built with</IonLabel>
                        <IonNote slot="end">Ionic React</IonNote>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Settings;
