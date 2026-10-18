import { IonButton, IonChip, IonContent, IonIcon, IonModal } from '@ionic/react';
import {
    closeOutline,
    globeOutline,
    locationOutline,
    maleFemaleOutline,
    tvOutline
} from 'ionicons/icons';
import { Character } from '../data/characters';

interface CharacterSheetProps {
    character: Character | null;
    isOpen: boolean;
    onClose: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, isOpen, onClose }) => {
    const facts = character
        ? [
            { icon: maleFemaleOutline, label: 'Gender', value: character.gender },
            { icon: globeOutline, label: 'Origin', value: character.origin.name },
            { icon: locationOutline, label: 'Last seen', value: character.location.name },
            { icon: tvOutline, label: 'Episodes', value: String(character.episode.length) }
        ]
        : [];

    return (
        // A sheet modal slides up and snaps to the breakpoints (share of the screen height)
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onClose}
            initialBreakpoint={0.75}
            breakpoints={[0, 0.75, 1]}
            className="character-sheet"
        >
            {character && (
                <IonContent>
                    <div className="sheet-hero">
                        <img className="sheet-hero-bg" src={character.image} alt="" aria-hidden="true" />
                        <img className="sheet-avatar" src={character.image} alt={character.name} />
                        <IonButton
                            className="sheet-close"
                            fill="clear"
                            shape="round"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <IonIcon slot="icon-only" icon={closeOutline} />
                        </IonButton>
                    </div>

                    <div className="sheet-body">
                        <h2>{character.name}</h2>
                        <div className="sheet-chips">
                            <IonChip className={`status-chip status-${character.status.toLowerCase()}`}>
                                <span className="status-dot" />
                                {character.status}
                            </IonChip>
                            <IonChip outline>{character.species}</IonChip>
                            {character.type && <IonChip outline>{character.type}</IonChip>}
                        </div>

                        <div className="sheet-facts">
                            {facts.map((fact) => (
                                <div className="sheet-fact" key={fact.label}>
                                    <IonIcon icon={fact.icon} aria-hidden="true" />
                                    <span className="sheet-fact-label">{fact.label}</span>
                                    <span className="sheet-fact-value">{fact.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </IonContent>
            )}
        </IonModal>
    );
};

export default CharacterSheet;
