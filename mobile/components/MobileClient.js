import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import './MobileClient.css';
import {clientEvents} from './events';

class MobileClient extends React.PureComponent {

    static propTypes = {
        id: PropTypes.number.isRequired,
        client: PropTypes.shape({
            fam: PropTypes.string.isRequired,
            im: PropTypes.string.isRequired,
            otch: PropTypes.string.isRequired,
            balance: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired

        }),
    };

    state = {
        client: this.props.client
    };

    componentDidUpdate = (oldProps, oldState) => {
        console.log("MobileClient id="+this.props.id+" componentDidUpdate");
        if ( this.props.client!==this.state.client ) {
            this.setState({client:this.props.client});
        }
        if ( this.props.status!==this.state.status ) {
            this.setState({status:this.props.status});
        }
    };

    edit = () => {
        clientEvents.emit('EClientChanged',this.state.client.id);
    };

    delete = () => {
        clientEvents.emit('EClientDeleted',this.state.client.id);
    };

    render() {
        console.log("MobileClient id="+this.props.id+" render");
    
        return (
            <tr className='MobileClient'>
                <td>{this.state.client.fam}</td>
                <td>{this.state.client.im}</td>
                <td>{this.state.client.otch}</td>
                <td>{this.state.client.balance}</td>
                <td className={this.state.client.status}>{this.state.client.status}</td>
                <td><input type="button" value="Редактировать" onClick={this.edit} /></td>
                <td><input type="button" value="Удалить" onClick={this.delete} /></td>
            </tr>
        );
    }
}

export default MobileClient;
