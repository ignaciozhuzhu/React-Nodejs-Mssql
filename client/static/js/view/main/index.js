var React = require('react');
var ReactDOM = require('react-dom');
var store = require('../../store/main');

class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            messageList2: []
        };
        this.getTable();
    }

    render() {
        var self = this;
        var messages = this.state.messageList;
        var arrhead = this.state.messageList2;
        var arr = [];
        var arr2 = [];
        arrhead
            .forEach(function(em) {
                arr2.push(
                    <th  key={em.name} style={{border:"1px solid"}}>{em.name} </th>
                );
            });

        messages
            .forEach(function(em) {
                arr.push(
                    <tr key={em.openid}>
                      <td style={{border:"1px solid"}}>{em.Id} </td>
                      <td style={{border:"1px solid"}}>{em.openid} </td>
                      <td style={{border:"1px solid"}}> {em.mobile}</td>
                    </tr>
                );
            });
        return (<div>
                    <table> 
                        <thead>
                        <tr>
                        {arr2}
                         </tr>
                         </thead>
                         <tbody>
                        {arr}
                        </tbody>
                    </table>
                </div>)
    }

    getTable() {
        var self = this;
        store
            .getData(function(data) {
                var i = 0;
                var len = data.length;
                var messageListArr = [];
                for (; i < len; i++) {
                    messageListArr[i] = data[i];
                }
                self.setState({
                    messageList: messageListArr
                });
                console.log(self.state.messageList);
            })
        store
            .getHead(function(data) {
                var i = 0;
                var len = data.length;
                var messageListArr = [];
                var data2 = [];
                for (; i < len; i++) {
                    messageListArr[i] = data[i];
                }
                self.setState({
                    messageList2: messageListArr
                });
                console.log(self.state.messageList2);
            })
    }
}

ReactDOM.render(
    <MessageList />,
    document.getElementById('main-container')
);