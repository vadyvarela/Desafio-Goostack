import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  padding: 0 30px;
`;

export const Content = styled.div`
  height: 64px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    align-items: center;

    img {
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #eee;
    }

    a {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      font-weight: bold;
      color: #999;
    }
  }

  aside {
    display: flex;
    align-items: center;
  }
`;

export const Profile = styled.div`
  display: flex;
  margin-right: 20px;
  padding-right: 20px;
  border-right: 1px solid #eee;

  div {
    text-align: right;
    margin-right: 10px;

    strong {
      font-weight: normal
      font-size: 1.2em;
      display: block;
      color: #333;
    }
    button {
      display: flex;
      align-items: center;
      border: 0;
      background: none;
      margin-top: 2px;
      font-size: 12px;
      color: #ee4d64;
      float: right;
    }
  }
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
`;
