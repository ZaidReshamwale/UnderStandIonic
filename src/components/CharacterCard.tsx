import { IonCard, IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { Character } from '../data/characters';

interface CharacterCardProps {
    character: Character;
    index: number;
    onSelect: (character: Character) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, index, onSelect }) => (
    <IonCard
        button
        className="character-card"
        style={{ animationDelay: `${(index % 20) * 40}ms` }}
        onClick={() => onSelect(character)}
    >
        <div className="character-image">
            <img src={character.image} alt={character.name} loading="lazy" />
            <span className={`status-pill status-${character.status.toLowerCase()}`}>
                <span className="status-dot" />
                {character.status}
            </span>
        </div>
        <div className="character-info">
            <h3>{character.name}</h3>
            <p className="character-species">{character.species}</p>
            <p className="character-location">
                <IonIcon icon={locationOutline} aria-hidden="true" />
                <span>{character.location.name}</span>
            </p>
        </div>
    </IonCard>
);

export default CharacterCard;
