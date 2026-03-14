import { useMemo } from 'react';
import { Dropdown, Item } from 'react-basics';
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

  const websites = useMemo(() => data?.data || [], [data]);

  const renderValue = value => {
    return websites.find(({ id }) => id === value)?.name;
  };

  return (
    <Dropdown
      items={websites}
      value={websiteId}
      renderValue={renderValue}
      onChange={onSelect}
      alignment="end"
      placeholder={formatMessage(labels.selectWebsite)}
      menuProps={{ style: { maxHeight: 300, overflowY: 'auto' } }}
    >
      {({ id, name }) => <Item key={id}>{name}</Item>}
    </Dropdown>
  );
}

export default WebsiteSelect;
