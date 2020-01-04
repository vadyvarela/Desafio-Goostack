import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '~/components/Header';
import Button from '~/components/Button';

import api from '~/services/api';

import {
  Container,
  Content,
  CheckinList,
  Checkin,
  CheckinNumber,
  CheckinDate,
} from './styles';

export default function Checkins() {
  const [page, setPage] = useState(1);
  const [scrollMomentum, setScrollMomentum] = useState(false);
  const [showLoadingMoreIndicator, setShowLoadingMoreIndicator] = useState(
    false
  );
  const [noMoreData, setNoMoreData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const { id } = useSelector(state => state.student.student);

  function removeDuplicates(list, attribute) {
    return list.filter(
      (item, pos) =>
        list.map(checkin => checkin[attribute]).indexOf(item[attribute]) === pos
    );
  }

  function formatDateRelative(date) {
    return formatRelative(parseISO(date), new Date(), {
      locale: pt,
      addSuffix: true,
    });
  }

  async function fetchCheckins(newPage) {
    const { data } = await api.get(`students/${id}/checkins?page=${newPage}`);

    if (!data.length) {
      if (newPage === 1) {
        setCheckins([]);
      }

      setNoMoreData(true);
    } else {
      setNoMoreData(false);

      const newData = data.map(checkin => ({
        ...checkin,
        formattedDate: formatDateRelative(checkin.created_at),
      }));
      if (newPage === 1) {
        setCheckins(newData);
      } else {
        const newCheckins = [...checkins, ...newData];
        setCheckins(removeDuplicates(newCheckins, 'id'));
      }
    }

    setLoadingMore(false);
    setRefreshing(false);
    setShowLoadingMoreIndicator(false);

    setPage(newPage);
  }

  useEffect(() => {
    fetchCheckins(page);
  }, [page]); //eslint-disable-line

  async function handleCreateCheckin() {
    try {
      const { data } = await api.post(`/students/${id}/checkins`);

      const newCheckins = [
        { ...data, formattedDate: formatDateRelative(data.created_at) },
        ...checkins,
      ];

      setCheckins(newCheckins);
    } catch (err) {
      Alert.alert('Erro', 'Provalvelmente voce ja fez checkin hoje');
    }
  }

  async function handleLoadMore() {
    if (scrollMomentum) {
      setScrollMomentum(false);
      setLoadingMore(true);
      const newPage = page + 1;
      await fetchCheckins(newPage);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    fetchCheckins(1);
  }

  function renderFooter() {
    return (
      showLoadingMoreIndicator && (
        <View style={{ marginTop: 10 }}>
          <ActivityIndicator size={22} />
        </View>
      )
    );
  }

  return (
    <>
      <Container>
        <Header />

        <Content>
          <Button onPress={handleCreateCheckin}>Novo check-in</Button>

          <CheckinList
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              if (!loadingMore && !refreshing) {
                handleLoadMore();
              }
            }}
            onMomentumScrollBegin={() => {
              setScrollMomentum(true);
              if (!noMoreData) {
                setShowLoadingMoreIndicator(true);
              }
            }}
            data={checkins}
            keyExtractor={item => String(item.id)}
            ListFooterComponent={renderFooter}
            renderItem={({ item, index }) => (
              <Checkin>
                <CheckinNumber>{`Checkin #${checkins.length -
                  index}`}</CheckinNumber>
                <CheckinDate>{item.formattedDate}</CheckinDate>
              </Checkin>
            )}
          />
        </Content>
      </Container>
    </>
  );
}

const tabBarIcon = ({ tintColor }) => (
  <Icon name="edit-location" size={20} color={tintColor} />
);

tabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Checkins.navigationOptions = {
  tabBarLabel: 'Check-ins',
  tabBarIcon,
};
