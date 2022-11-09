import { Accordion } from '@rocket.chat/fuselage';
import React, { FC } from 'react';

import Page from '../../components/Page';
import { MessageWithMdEnforced } from '../room/MessageList/lib/parseMessageTextToAstMarkdown';
import Header from './components/Header';
import MessageList from './components/MessageList';
import { useUnreads } from './hooks/useUnreads';

const UnreadsPage: FC = () => {
	const t = useTranslation();

	const [loading, error, unreads] = useUnreads();

	const totals = useMemo(() => {
		const totals = {
			messages: 0,
			threads: 0,
		};

		unreads.forEach((room) => {
			totals.messages += room?.messages?.length || 0;
			totals.threads += room?.threads?.length || 0;
		});

		return totals;
	}, [unreads]);

	function getTotalMessages(unread: any): any {
		const lastThread = unread?.threads?.length ? unread?.threads[0]?.messages.slice(-1)[0] : {};
		const messages = unread?.messages
			? unread.messages?.map((msg: MessageWithMdEnforced) => {
					if (msg._id === lastThread?._id) {
						return { ...lastThread, isThreadMessage: true };
					}
					return { ...msg, isThreadMessage: false };
			  })
			: [];
		return messages;
	}

	return (
		<Page.ScrollableContentWithShadow>
			{unreads.map((unread) => (
				<Accordion.Item key={unread._id} title={<Header room={unread} />}>
					<MessageList rid={unread._id} messages={getTotalMessages(unread)} />
				</Accordion.Item>
			))}
		</Page.ScrollableContentWithShadow>
	);
};

export default UnreadsPage;
