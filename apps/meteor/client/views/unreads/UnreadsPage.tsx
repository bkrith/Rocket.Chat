import { Accordion, Box, Button, ButtonGroup, Icon } from '@rocket.chat/fuselage';
import { Header } from '@rocket.chat/ui-client';
import { useEndpoint, useTranslation } from '@rocket.chat/ui-contexts';
import React, { FC, memo, useEffect, useMemo, useState } from 'react';

import Page from '../../components/Page';
import PageSkeleton from '../../components/PageSkeleton';
import { MessageWithMdEnforced } from '../room/MessageList/lib/parseMessageTextToAstMarkdown';
import AccordionHeader from './components/body/AccordionHeader';
import ResultMessage from './components/body/ResultMessage';
import MessageList from './components/messages/MessageList';
import { useUnreads } from './hooks/useUnreads';

import './styles/accordion.css';

const UnreadsPage: FC = () => {
	const t = useTranslation();
	const readMessages = useEndpoint('POST', '/v1/subscriptions.read');
	const [loading, error, unreads, fetchMessages] = useUnreads();
	const [expandedItem, setExpandedItem] = useState(null);
	const [activeMessages, setActiveMessages] = useState<MessageWithMdEnforced[]>([]);

	const totals = useMemo(() => {
		const totals = {
			messages: 0,
			threads: 0,
		};

		unreads?.forEach((room) => {
			total += room?.unread + (room?.tunread?.length || 0);
		});

		return totals;
	}, [unreads]);

	async function handleMarkAll(): Promise<void> {
		if (unreads) await Promise.all(unreads.map((room) => readMessages({ rid: room.rid })));
		setExpandedItem(null);
		setActiveMessages([]);
	}

	async function handleMark(rid: string): Promise<void> {
		await readMessages({ rid });
		setExpandedItem(null);
		setActiveMessages([]);
	}

	async function getMessages(room: any): Promise<void> {
		if (expandedItem === room._id) {
			setExpandedItem(null);
			setActiveMessages([]);
			return;
		}
		const messages = await fetchMessages(room);
		setExpandedItem(room._id);
		setActiveMessages(messages);
	}

	useEffect(() => {
		unreads?.forEach(async (room) => {
			if (expandedItem === room._id) {
				const messages = await fetchMessages(room);
				setExpandedItem(room._id);
				setActiveMessages(messages);
			}
		});
	}, [unreads, expandedItem, fetchMessages]);

	return (
		<Page>
			{error && !loading && <ResultMessage />}
			{unreads && !unreads.length && !loading && <ResultMessage empty />}
			{!!loading && <PageSkeleton />}
			{unreads && unreads.length > 0 && !loading && (
				<>
					<Page.Header
						title={
							<Header.Content.Row>
								<Header.Title is='h1'>{`${totalMessages} ${t('Unread_Messages')}`}</Header.Title>
							</Header.Content.Row>
						}
					>
						<ButtonGroup>
							<Button onClick={handleMarkAll}>
								<Icon name={'flag'} size='x20' margin='4x' />
								<span style={{ marginLeft: '10px' }}>{t('Mark_all_as_read_short')}</span>
							</Button>
						</ButtonGroup>
					</Page.Header>
					<Page.ScrollableContentWithShadow>
						<Box marginBlock='none' paddingBlock='none' marginInline='auto' width='full'>
							<Accordion borderBlockStyle='unset'>
								{unreads.map((room) => (
									<div className='unreadsAccordionHeader' key={room._id}>
										<Accordion.Item
											title={<AccordionHeader room={room} handleMark={(): Promise<void> => handleMark(room.rid)} />}
											expanded={expandedItem === room._id}
											onToggle={(): void => {
												getMessages(room);
											}}
										>
											<MessageList messages={activeMessages} rid={room.rid} />
										</Accordion.Item>
									</div>
								))}
							</Accordion>
						</Box>
					</Page.ScrollableContentWithShadow>
				</>
			)}
		</Page>
	);
};

export default memo(UnreadsPage);
