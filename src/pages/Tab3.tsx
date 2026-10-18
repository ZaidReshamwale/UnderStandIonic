import { useCallback, useEffect, useState } from 'react';
import {
  InfiniteScrollCustomEvent,
  IonButton,
  IonCard,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
  useIonLoading,
  useIonToast
} from '@ionic/react';
import { cloudOfflineOutline, refreshOutline, sadOutline, shuffle } from 'ionicons/icons';
import CharacterCard from '../components/CharacterCard';
import CharacterSheet from '../components/CharacterSheet';
import { Character, StatusFilter, fetchCharacters, fetchRandomCharacter } from '../data/characters';
import "./Tab3.css";


const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'alive', label: 'Alive' },
  { value: 'dead', label: 'Dead' },
  { value: 'unknown', label: 'Unknown' }
];

// Grey placeholder shown while the first page is loading
const SkeletonCard: React.FC = () => (
  <IonCard className="character-card">
    <IonSkeletonText animated className="skeleton-image" />
    <div className="character-info">
      <IonSkeletonText animated style={{ width: '75%' }} />
      <IonSkeletonText animated style={{ width: '45%' }} />
    </div>
  </IonCard>
);

const Tab3: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Character | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentToast] = useIonToast();

  // Loads page 1 for the current search and filter, replacing the list
  const loadFirstPage = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError('');
      try {
        const result = await fetchCharacters(1, search, status, signal);
        setCharacters(result.characters);
        setTotal(result.total);
        setHasMore(result.hasMore);
        setPage(1);
      } catch (err) {
        if (signal?.aborted) return; // a newer search replaced this request
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [search, status]
  );

  // Runs on the first visit and again whenever the search or filter changes
  useEffect(() => {
    const controller = new AbortController();
    loadFirstPage(controller.signal);
    // Cancel the old request so a slow answer can't overwrite newer results
    return () => controller.abort();
  }, [loadFirstPage]);

  const handleRefresh = async (event: RefresherCustomEvent) => {
    await loadFirstPage();
    event.detail.complete();
  };

  const loadMore = async (event: InfiniteScrollCustomEvent) => {
    try {
      const result = await fetchCharacters(page + 1, search, status);
      setCharacters((prev) => [...prev, ...result.characters]);
      setHasMore(result.hasMore);
      setPage(page + 1);
    } catch {
      presentToast({
        message: 'Could not load more characters',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
    } finally {
      event.target.complete();
    }
  };

  const openCharacter = (character: Character) => {
    setSelected(character);
    setIsSheetOpen(true);
  };

  const openRandomCharacter = async () => {
    await presentLoading({ message: 'Opening a portal…', spinner: 'crescent' });
    try {
      openCharacter(await fetchRandomCharacter());
    } catch {
      presentToast({
        message: 'The portal is closed. Try again!',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
    } finally {
      dismissLoading();
    }
  };

  const showSkeletons = loading && characters.length === 0;
  const isEmpty = !loading && characters.length === 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Explore</IonTitle>
          {loading && <IonProgressBar type="indeterminate" />}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Explore</IonTitle>
          </IonToolbar>
        </IonHeader>

        <section className="explore-hero">
          <div className="portal" aria-hidden="true" />
          <p className="explore-eyebrow">Mini project · Web API</p>
          <h1>Multiverse Explorer</h1>
          <p className="explore-subtitle">
            {loading && total === 0
              ? 'Searching the multiverse…'
              : `${total} character${total === 1 ? '' : 's'} found`}
          </p>
        </section>

        <div className="explore-controls">
          <IonSearchbar
            placeholder="Search by name"
            debounce={400}
            onIonInput={(e) => setSearch(e.detail.value ?? '')}
          />
          <IonSegment
            value={status}
            onIonChange={(e) => setStatus(e.detail.value as StatusFilter)}
          >
            {STATUS_FILTERS.map((filter) => (
              <IonSegmentButton key={filter.value} value={filter.value}>
                <IonLabel>{filter.label}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </div>

        {error && (
          <div className="explore-state">
            <IonIcon icon={cloudOfflineOutline} aria-hidden="true" />
            <h2>Lost in another dimension</h2>
            <p>{error}. Check your connection and try again.</p>
            <IonButton shape="round" onClick={() => loadFirstPage()}>
              <IonIcon slot="start" icon={refreshOutline} />
              Try again
            </IonButton>
          </div>
        )}

        {!error && isEmpty && (
          <div className="explore-state">
            <IonIcon icon={sadOutline} aria-hidden="true" />
            <h2>Nobody here</h2>
            <p>No character matches this search. Try another name or filter.</p>
          </div>
        )}

        {!error && !isEmpty && (
          <div className="character-grid">
            {showSkeletons
              ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
              : characters.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  index={index}
                  onSelect={openCharacter}
                />
              ))}
          </div>
        )}

        <IonInfiniteScroll onIonInfinite={loadMore} disabled={!hasMore || loading || !!error}>
          <IonInfiniteScrollContent loadingSpinner="dots" loadingText="Loading more characters…" />
        </IonInfiniteScroll>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton
            className="random-fab"
            onClick={openRandomCharacter}
            aria-label="Show a random character"
          >
            <IonIcon icon={shuffle} />
          </IonFabButton>
        </IonFab>

        <CharacterSheet
          character={selected}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
