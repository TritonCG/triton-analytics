import { useMemo, useState } from 'react';
import { Dropdown, Item, SearchField, Flexbox } from 'react-basics';
import useApi from 'components/hooks/useApi';
import useMessages from 'components/hooks/useMessages';

export function WebsiteSelect({ websiteId, onSelect }) {
  const { formatMessage, labels } = useMessages();
  const { get, useQuery } = useApi();
  const { data } = useQuery(['websites:me:all'], async () => {
    const pageSize = 200;
    let page = 1;
    const allWebsites = [];

    while (page) {
      const result = await get('/me/websites', { includeTeams: 1, page, pageSize });
      const currentPage = result?.data || [];
      const totalCount = result?.count;

      allWebsites.push(...currentPage);

      if (
        currentPage.length < pageSize ||
        (typeof totalCount === 'number' && allWebsites.length >= totalCount)
      ) {
        page = 0;
      } else {
        page += 1;
      }
    }

    return {
      data: allWebsites,
      count: allWebsites.length,
    };
  });
  const [filter, setFilter] = useState('');

  const websites = useMemo(() => data?.data || [], [data]);
  const items = useMemo(() => {
    if (!filter) {
      return websites;
    }

    const search = filter.toLowerCase();

    return websites.filter(({ name }) => name?.toLowerCase().includes(search));
  }, [websites, filter]);

  const renderValue = value => {
    return websites.find(({ id }) => id === value)?.name;
  };

  return (
    <Flexbox direction="column" gap={8}>
      <SearchField
        value={filter}
        onChange={setFilter}
        placeholder={formatMessage(labels.search)}
        autoComplete="off"
      />
      <Dropdown
        items={items}
        value={websiteId}
        renderValue={renderValue}
        onChange={onSelect}
        alignment="end"
        placeholder={formatMessage(labels.selectWebsite)}
        menuProps={{ style: { maxHeight: 300, overflowY: 'auto' } }}
      >
        {({ id, name }) => <Item key={id}>{name}</Item>}
      </Dropdown>
    </Flexbox>
  );
}

export default WebsiteSelect;
