import type { Leader, LeaderWikiData } from '../types';

const CACHE_PREFIX = 'ng_leader_museum_wiki_v1_';

/**
 * Clean honorific titles from names to get clean initials
 */
function getInitials(name: string): string {
  const parts = name.split(' ');
  const cleanParts = parts.filter(p => {
    const lower = p.toLowerCase();
    return (
      !lower.startsWith('sir') &&
      !lower.startsWith('lord') &&
      !lower.startsWith('dr') &&
      !lower.startsWith('chief') &&
      !lower.startsWith('general') &&
      !lower.startsWith('major') &&
      !lower.startsWith('alhaji') &&
      !lower.startsWith('asiwaju') &&
      !lower.startsWith('premier') &&
      !lower.startsWith('governor')
    );
  });
  const initials = cleanParts.map(p => p[0]).join('');
  return (initials.substring(0, 2) || name.substring(0, 2) || 'NL').toUpperCase();
}

/**
 * Fetch leader biography and portrait from Wikipedia APIs.
 * Utilizes local storage cache for immediate subsequent loads.
 */
export async function fetchLeaderWikiData(leader: Leader): Promise<LeaderWikiData> {
  const cacheKey = `${CACHE_PREFIX}${leader.id}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const data = JSON.parse(cached) as LeaderWikiData;
      // Safeguard: Ensure valid structure
      if (data && data.summary && data.portraitUrl) {
        return data;
      }
    } catch (e) {
      console.warn(`Cache corrupted for leader ${leader.id}, re-fetching.`, e);
    }
  }

  const initials = getInitials(leader.name);
  const fallbackPortrait = `fallback:${initials}:${leader.name}`;
  
  let summary = `No official biography available. ${leader.name} served as ${leader.role} between ${leader.startYear} and ${leader.endYear}.`;
  let portraitUrl = fallbackPortrait;
  let role = leader.role;
  const lifespan = leader.birthYear
    ? `${leader.birthYear} – ${leader.deathYear || 'Present'}`
    : 'Date of birth unknown';

  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(leader.wikipediaTitle)}`;

  try {
    // 1. Fetch REST summary (quick, CORS-enabled by default)
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(leader.wikipediaTitle)}`
    );

    if (summaryRes.ok) {
      const summaryData = await summaryRes.json();
      if (summaryData.extract) {
        summary = summaryData.extract;
      }
      if (summaryData.description) {
        role = summaryData.description;
      }
      if (summaryData.originalimage?.source) {
        portraitUrl = summaryData.originalimage.source;
      } else if (summaryData.thumbnail?.source) {
        portraitUrl = summaryData.thumbnail.source;
      }
    }

    // 2. Fetch high-resolution portrait if it is not already a large source
    if (portraitUrl !== fallbackPortrait) {
      try {
        const queryRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=1000&titles=${encodeURIComponent(
            leader.wikipediaTitle
          )}&origin=*`
        );
        if (queryRes.ok) {
          const queryData = await queryRes.json();
          const pages = queryData.query?.pages;
          if (pages) {
            const pageId = Object.keys(pages)[0];
            const page = pages[pageId];
            if (page?.thumbnail?.source) {
              portraitUrl = page.thumbnail.source;
            }
          }
        }
      } catch (innerErr) {
        console.warn(`Failed to fetch high-res image for ${leader.name}, using default:`, innerErr);
      }
    }
  } catch (err) {
    console.error(`Failed to fetch Wikipedia summary for ${leader.name}:`, err);
  }

  const result: LeaderWikiData = {
    id: leader.id,
    name: leader.name,
    wikipediaTitle: leader.wikipediaTitle,
    summary,
    portraitUrl,
    role: role || leader.role,
    lifespan,
    wikiUrl
  };

  // Cache the result
  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch (cacheErr) {
    console.warn(`Could not cache Wikipedia result for ${leader.id} (quota exceeded):`, cacheErr);
  }

  return result;
}
