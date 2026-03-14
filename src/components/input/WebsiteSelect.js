import { useMemo, useState } from 'react';
import { Dropdown, Item, SearchField, Flexbox } from 'react-basics';
import useApi from 'components/hooks/useApi';
import useMessages from 'components/hooks/useMessages';

export function WebsiteSelect({ websiteId, onSelect }) {
  const { formatMessage, labels } = useMessages();
  const { get, useQuery } = useApi();
  const { data } = useQuery(['websites:me'], () => get('/me/websites'));
  const [filter, setFilter] = useState('');

  const websites = data?.data || [];
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
