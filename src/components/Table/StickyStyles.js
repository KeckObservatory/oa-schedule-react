import styled from 'styled-components';

export const Styles = styled.div`
  .table {
    border-collapse: collapse;
    text-align: center;
    width: 100%;
    height: 92vh;

    .tr {
      background-color: #FFFFFF;
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .tr:hover {
      background-color: #456C98;
    }
    .tr:hover {
      color: #FFFFFF;
    }

    .th{
      padding-top: 12px;
      padding-left: 12px;
      padding-right: 12px;
      padding-bottom: 12px;
      text-align: center;
      background-color: #2C5583;
      color: white;
      border: 1px solid #ddd;
      border-top: none
    }

    .tf {
      padding-top: 12px;
      padding-left: 12px;
      padding-right: 12px;
      padding-bottom: 12px;
      text-align: center;
      background-color: #2C5583;
      color: white;
      border: 1px solid #ddd;
      border-top: none
    }

    .td {
      border: 1px solid #ddd;
      padding: 5px;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`;
