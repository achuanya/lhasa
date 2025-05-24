import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const calendarIconSvg = `
  <svg class="inline-block size-6 min-w-[1.375rem]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>`;

function formatFeedDate(dateString, tz) {
  if (!dateString) return { iso: '', date: '', time: '' };
  try {
    // @ts-ignore
    const datetime = dayjs(dateString).tz(tz || 'UTC');
    return {
      iso: datetime.toISOString(),
      date: datetime.format('D MMM, YYYY'),
      time: datetime.format('hh:mm A'),
    };
  } catch (e) {
    return { iso: '', date: 'Invalid Date', time: '' };
  }
}

function createFeedCardHTML(item, siteTimezone, fallbackOgImageGlobal) {
  const pubDate = formatFeedDate(item.published, siteTimezone);
  const description = `来自 ${item.blog_name}`;
  const shortDescription = description.length > 40 ? description.substring(0, 40) + "..." : description;

  const defaultImageClass = "w-[76px] sm:w-[81.78px] h-auto object-cover rounded-md aspect-square group-hover:opacity-90 transition-opacity duration-300";

  let imgSrc = item.avatar || '';
  if ((!imgSrc || imgSrc.trim() === "") && fallbackOgImageGlobal) {
    imgSrc = fallbackOgImageGlobal;
  }
  
  const onerrorHandler = fallbackOgImageGlobal ? `this.onerror=null; this.src='${fallbackOgImageGlobal}';` : '';

  return `
    <li class="my-6 flex flex-row gap-6 items-start">
      ${imgSrc ? `
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="shrink-0 mx-auto">
          <img
            src="${imgSrc}"
            alt="${item.title}"
            class="${defaultImageClass}" 
            loading="lazy"
            onerror="${onerrorHandler}"
          />
        </a>
      ` : ''}
      <div class="flex-grow">
        <a
          href="${item.link}" target="_blank" rel="noopener noreferrer"
          class="inline-block text-lg font-medium text-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
        >
          <h3 class="text-lg font-medium decoration-dashed hover:underline">${item.title}</h3>
        </a>
        <div class="flex items-end space-x-2 opacity-80 mt-1">
          ${calendarIconSvg}
          <span class="sr-only">Published:</span>
          <span class="text-sm italic">
            <time datetime="${pubDate.iso}">${pubDate.date}</time>
            <span aria-hidden="true"> | </span>
            <span class="sr-only">&nbsp;at&nbsp;</span>
            <span class="text-nowrap">${pubDate.time}</span>
          </span>
        </div>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
          ${shortDescription}
        </p>
      </div>
    </li>
  `;
}

export function initFeeds(allFeedsFromServer, siteTimezone, fallbackOgImageGlobal, initialItemCount, itemsPerPage) {
  const feedsListElement = document.getElementById('feeds-list');
  const loadMoreTrigger = document.getElementById('load-more-trigger');

  if (!feedsListElement) {
    return;
  }
  
  let currentIndex = initialItemCount;

  function loadMoreItems() {
    if (!feedsListElement) {
        return;
    }
    const itemsToLoad = allFeedsFromServer.slice(currentIndex, currentIndex + itemsPerPage);

    if (itemsToLoad.length === 0 && loadMoreTrigger) {
      loadMoreTrigger.style.display = 'none'; 
      if (observer) {
        observer.disconnect();
      }
      return;
    }

    let newItemsHTML = '';
    itemsToLoad.forEach(item => {
      newItemsHTML += createFeedCardHTML(item, siteTimezone, fallbackOgImageGlobal);
    });
    feedsListElement.insertAdjacentHTML('beforeend', newItemsHTML);
    currentIndex += itemsToLoad.length;

    if (currentIndex >= allFeedsFromServer.length && loadMoreTrigger) {
        loadMoreTrigger.style.display = 'none';
        if(observer) {
            observer.disconnect();
        }
    }
  }

  let observer;
  if (loadMoreTrigger && allFeedsFromServer.length > initialItemCount) {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreItems();
      }
    }, { threshold: 0.1 });
    observer.observe(loadMoreTrigger);
  } else if (loadMoreTrigger) {
    loadMoreTrigger.style.display = 'none';
  }
} 