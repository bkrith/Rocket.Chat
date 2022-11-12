import { Button, ButtonGroup, Icon } from '@rocket.chat/fuselage';
import { useEndpoint, useTranslation } from '@rocket.chat/ui-contexts';
import { FlowRouter } from 'meteor/kadira:flow-router';
import React, { FC, memo, useEffect, useMemo, useState } from 'react';

import { MessageAction } from '../../../app/ui-utils/client/lib/MessageAction';
import Page from '../../components/Page';
import PageSkeleton from '../../components/PageSkeleton';
import { MessageWithMdEnforced } from '../room/MessageList/lib/parseMessageTextToAstMarkdown';
import ResultMessage from './components/body/ResultMessage';
import UnreadsBody from './components/body/UnreadsBody';
import UnreadsHeader from './components/headers/UnreadsHeader';
import { IUnreadRoom, useUnreads } from './hooks/useUnreads';

import './styles/accordion.css';

type IUnreadHistoryRoom = IUnreadRoom & { undo?: boolean };

const maxLoading = 4000;

const UnreadsPage: FC = () => {
	const readMessages = useEndpoint('POST', '/v1/subscriptions.read');
	const unreadMessages = useEndpoint('POST', '/v1/subscriptions.unread');
	const [loading, error, unreads, fetchMessages] = useUnreads();
	const t = useTranslation();
	const [expandedItem, setExpandedItem] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState('Activity');
	const [activeMessages, setActiveMessages] = useState<MessageWithMdEnforced[]>([]);
	const [undoAllHistory, setUndoAllHistory] = useState<any[]>([]);
	const [pageLoading, setPageLoading] = useState<boolean>(true);

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

	const fusedRoomsWithUndoAndSort = useMemo(
		() =>
			[...undoAllHistory.map((room: any) => ({ ...room, undo: true })), ...(unreads || [])].sort((a: any, b: any) =>
				sortBy !== 'Activity' ? a?.name?.localeCompare(b?.name) : b?.lm - a?.lm,
			),
		[undoAllHistory, unreads, sortBy],
	);

	async function handleMarkAll(): Promise<void> {
		if (undoAllHistory.length) {
			await Promise.all(undoAllHistory.map((room) => unreadMessages({ roomId: room.rid })));
			setUndoAllHistory([]);
		} else if (unreads) {
			setUndoAllHistory([...unreads.map((room: IUnreadHistoryRoom) => ({ ...room, undo: true }))]);
			await Promise.all(unreads.map((room) => readMessages({ rid: room.rid })));
		}
		setExpandedItem(null);
		setActiveMessages([]);
	}

	async function handleMark(room: IUnreadRoom): Promise<void> {
		const index = undoAllHistory.findIndex((r) => r.rid === room.rid);
		if (index >= 0) {
			await unreadMessages({ roomId: room.rid });
			undoAllHistory.splice(index, 1);
			setUndoAllHistory(undoAllHistory);
		} else {
			setUndoAllHistory([...undoAllHistory, room]);
			await readMessages({ rid: room.rid });
		}
		setExpandedItem(null);
		setActiveMessages([]);
	}

	async function getMessages(room: IUnreadHistoryRoom): Promise<void> {
		if (expandedItem === room._id) {
			setExpandedItem(null);
			setActiveMessages([]);
		} else if (room.undo) {
			setExpandedItem(room._id);
			setActiveMessages([]);
		} else {
			setExpandedItem(room._id);
			const messages = await fetchMessages(room);
			setActiveMessages(messages);
		}
	}

	async function handleRedirect(): Promise<void> {
		if (activeMessages.length === 0) return;

		const permalink = await MessageAction.getPermaLink(activeMessages[0]._id);

		const urlWithoutProtocol = permalink.slice(permalink.indexOf('//') + 2);
		const messageUrl = urlWithoutProtocol.slice(urlWithoutProtocol.indexOf('/'));

		FlowRouter.go(messageUrl);
	}

	useEffect(() => {
		if (unreads?.length) setPageLoading(false);

		unreads?.some(async (room) => {
			if (expandedItem === room._id) {
				const messages = await fetchMessages(room);
				setExpandedItem(room._id);
				setActiveMessages(messages);
			}
		});
	}, [unreads, expandedItem, fetchMessages]);

	useEffect(() => {
		const loadingTimeout = setTimeout(() => {
			setPageLoading(false);
		}, maxLoading);

		return () => clearTimeout(loadingTimeout);
	}, []);

	if (error) {
		return (
			<Page>
				<ResultMessage />
			</Page>
		);
	}

	if (loading || pageLoading) {
		return (
			<Page>
				<PageSkeleton />
			</Page>
		);
	}

	if (!pageLoading && (!unreads || !unreads?.length)) {
		return (
			<Page>
				<ResultMessage empty>
					{!!undoAllHistory.length && (
						<ButtonGroup
							padding={20}
							paddingBlockEnd={20}
							display='flex'
							flexDirection='row'
							justifyContent='center'
							alignItems='center'
							width='full'
						>
							<Button onClick={(): Promise<void> => handleMarkAll()}>
								<Icon name={'flag'} size='x20' margin='4x' />
								<span style={{ marginLeft: '10px' }}>{t('Undo')}</span>
							</Button>
						</ButtonGroup>
					)}
				</ResultMessage>
			</Page>
		);
	}

	return (
		<Page padding={0}>
			{error && !loading && <ResultMessage />}
			{unreads && !unreads.length && !loading && <ResultMessage empty />}
			{!!loading && <PageSkeleton />}
			{unreads && unreads.length > 0 && !loading && (
				<>
					<Page.Header
						className='unreadsSectionHeader'
						title={
							<UnreadsHeader
								totalMessages={totalMessages}
								totalRooms={unreads.length}
								handleMarkAll={(): Promise<void> => handleMarkAll()}
								sortBy={sortBy}
								setSortBy={(sortBy: string): void => setSortBy(sortBy)}
								hasUndo={!!undoAllHistory.length}
							/>
						}
					/>
					<Page.ScrollableContentWithShadow padding={0}>
						<UnreadsBody
							sortedRooms={fusedRoomsWithUndoAndSort}
							expandedItem={expandedItem}
							activeMessages={activeMessages}
							handleRedirect={(): Promise<void> => handleRedirect()}
							handleMark={(room): Promise<void> => handleMark(room)}
							getMessages={(room): Promise<void> => getMessages(room)}
						/>
					</Page.ScrollableContentWithShadow>
				</>
			)}
		</Page>
	);
};

export default memo(UnreadsPage);
