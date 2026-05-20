import './assets/style.css';
import SystemFacade from './SystemFacade';

window.system = await SystemFacade.build();
