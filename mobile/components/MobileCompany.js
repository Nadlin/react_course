import React from 'react';
import PropTypes from 'prop-types';

import MobileClient from './MobileClient';

import {clientEvents} from './events';

class MobileCompany extends React.PureComponent {

    static propTypes = {
        clients:PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                fam: PropTypes.string.isRequired,
                im: PropTypes.string.isRequired,
                otch: PropTypes.string.isRequired,
                balance: PropTypes.number.isRequired,
            })
        ),
    };

    state = {
        clients: this.props.clients,
        sShowBlocked: false,
        isShowActive: false,
        isClientChanging: false,
        isNewClientAdding: false,
        changingClient: {},
        clientsFitered: this.props.clients
    };

    componentDidMount = () => {
        clientEvents.addListener('EClientDeleted',this.deleteClient);
        clientEvents.addListener('EClientChanged',this.changeClient);
    };

    componentWillUnmount = () => {
        clientEvents.removeListener('EClientDeleted',this.deleteClient);
        clientEvents.removeListener('EClientChanged',this.changeClient);
    };

    newFamRef = React.createRef();
    newImRef = React.createRef();
    newOtchRef = React.createRef();
    newBalanceRef = React.createRef();

    deleteClient = (id) => {
        let newClients = this.state.clients.slice();
        for (let [key, client] of newClients.entries()) {
            if (client.id == id) {
                newClients.splice(key, 1);
                this.setState( {clients: newClients} );
                break;
            }
        }
    };

    changeClient = (id) => {
        let newClients = this.state.clients.slice();
        for (let [key, client] of newClients.entries()) {
            if (client.id == id) {
                let clientCh = this.state.clients[key];
                this.setState({isClientChanging: true, changingClient: clientCh});
                break;
            }
        }
    };

    showActive = () => {
        this.setState({isShowBlocked: false, isShowActive: true})
    };

    showBlocked = () => {
        this.setState({isShowBlocked: true, isShowActive: false})
    };

    showAll = () => {
        this.setState({isShowBlocked: false, isShowActive: false})
    };

    addClient = () => {
        this.setState({isNewClientAdding: true});
    };

    saveClient = () => {
        let cc = {...this.state.changingClient};
        if (this.newFamRef.current) { // когда может не быть this.newFamRef.current? обязательно ли проверять на это????. Даже если не редактирую поле - все равно true.
            let newFam=this.newFamRef.current.value;
            cc.fam = newFam;
        }
        if (this.newImRef.current) {
            let newIm=this.newImRef.current.value;
            cc.im = newIm;
        }
        if (this.newOtchRef.current) {
            let newOtch=this.newOtchRef.current.value;
            cc.otch = newOtch;
        }
        if (this.newBalanceRef.current) {
            let newBalance=this.newBalanceRef.current.value;
            cc.balance = parseInt(newBalance);
        }
        let clientsNew = [...this.state.clients],
            maxId = 1;
        clientsNew.forEach((client, i) => {
            if (this.state.isClientChanging && client.id == cc.id) {
                clientsNew[i] = cc;
            }
            if (this.state.isNewClientAdding) {
                maxId = (client.id > 1) ? client.id : maxId;
            }
        })
        if (this.state.isNewClientAdding) {
            cc.id = maxId + 5;
            clientsNew.push(cc);
        }
        this.setState({clients: clientsNew, isClientChanging: false, isNewClientAdding: false, changingClient: {}});
    };

  
    render() {

        console.log("MobileCompany render");

        const clientsCode=this.state.clients.map( (client, i) => {
            client.status = !!(client.balance > 0) ? 'active' : 'blocked';
            if ((this.state.isShowActive && client.balance > 0) ||
                (this.state.isShowBlocked && client.balance <=0) ||
                (!this.state.isShowBlocked && !this.state.isShowActive)) {
                return <MobileClient key={client.id} id={client.id} client={client} />;
            }
        });

        return (
            <div className='MobileCompany'>
                <input type="button" value="Все" onClick={this.showAll} />
                <input type="button" value="Активные" onClick={this.showActive} />
                <input type="button" value="Заблокированные" onClick={this.showBlocked} />
                <table className='MobileCompanyClients'>
                    <thead>
                        <tr>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Баланс</th>
                            <th>Статус</th>
                            <th>Редактировать</th>
                            <th>Удалить</th>
                        </tr>
                    </thead>
                    <tbody>{clientsCode}</tbody>
                </table>
                <input type="button" value="Добавить клиента" onClick={this.addClient} />
                {
                    (this.state.isClientChanging || this.state.isNewClientAdding) &&
                    <div>
                          <label>Фамилия:</label>
                          <input type="text" defaultValue={this.state.changingClient.fam} ref={this.newFamRef} /><br/>
                          <label>Имя:</label>
                          <input type="text" defaultValue={this.state.changingClient.im} ref={this.newImRef} /><br/>
                          <label>Отчество:</label>
                          <input type="text" defaultValue={this.state.changingClient.otch} ref={this.newOtchRef} /><br/>
                          <label>Баланс:</label>
                          <input type="text" defaultValue={this.state.changingClient.balance} ref={this.newBalanceRef} /><br/>
                          <input type="button" value="Сохранить" onClick={this.saveClient} />
                    </div>
                }
            </div>
        );
    }
}

export default MobileCompany;
