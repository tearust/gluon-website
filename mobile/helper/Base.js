import React from 'react';
import {EStyle, _} from './utils';
import pubsub from './pubsub';

export default class Base extends React.Component{
	constructor(p){
		super(p);
		this.__type = 'acn_rn';

		this.state = this._defineState();

		this._props = this._defineMainProperty();

		if(this.props.route && this.props.route.name){
			const name = this.props.route.name;
			pubsub.subscribe('route-change__'+name, ()=>{
				this.componentActive();
			})
		}

		this._init();
		
	}
	// _setState(map){
	// 	this._setStateBefore(map);
	// 	super.setState(map);
	// 	this._setStateAfter(map);
	// }

	render(){
		const style = EStyle.create(this._defineStyle());
		const p = this._props;

		return this.renderMain(p, style);
	}

	//override
	renderMain(){
		throw 'must override renderMain method';
	}
	_defineState(){
		return {};
	}
	_init(){}
	_setStateBefore(){}
	_setStateAfter(){}

	_defineStyle(){return {};}
	_defineMainProperty(){
		return {
			...this.props
		};
	}

	// method
	_goPath(...arg){
		this.props.navigation && this.props.navigation.navigate(...arg);
	}
	_goReplace(...arg){
		this.props.navigation && this.props.navigation.replace(...arg);
	}
	_goBack(){
		this.props.navigation && this.props.navigation.goBack();
	}
	_getRouteParam(){
		return _.get(this.props.route, 'params', {});
	}


	_autorun(){}
	_autorunAfter(){}

	componentActive(){}
};