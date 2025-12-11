import SectionFrame from '../ui/SectionFrame';
import AnimateIn from '../utils/AnimateIn';
import wipData from '../../content/wip.json';
import './InProgressProcesses.css';

const InProgressProcesses = () => {
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'design': return 'DESIGN';
            case 'dev': return 'DEVELOPMENT';
            case 'testing': return 'TESTING';
            default: return status.toUpperCase();
        }
    };

    return (
        <SectionFrame id="in-progress" label="IN-PROGRESS PROCESSES" number="06">
            <AnimateIn className="wip-list" animation="scale-up" stagger={0.15}>
                {wipData.map((project) => (
                    <div key={project.id} className="wip-item">
                        <div className="wip-header">
                            <h3 className="wip-title">{project.title}</h3>
                            <span className="wip-status">{getStatusLabel(project.status)}</span>
                        </div>
                        <p className="wip-description">{project.description}</p>

                        <div className="wip-progress">
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                            <span className="progress-label">{project.progress}%</span>
                        </div>

                        <div className="wip-tech">
                            {project.tech.map((tech, idx) => (
                                <span key={idx} className="tech-badge">{tech}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </AnimateIn>
        </SectionFrame>
    );
};

export default InProgressProcesses;
