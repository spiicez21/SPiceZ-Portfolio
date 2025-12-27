import { useState, useEffect, memo } from 'react';
import SectionFrame from '../ui/SectionFrame';
import AnimateIn from '../utils/AnimateIn';
import { Star, GitFork } from 'lucide-react';
import './GitHubActivity.css';


interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
}

const GitHubActivity = () => {
    const username = 'Yugabharathi21';
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setRepos(data);
                } else {
                    console.error('GitHub API returned non-array:', data);
                    setRepos([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching repos:', err);
                setRepos([]); // Fallback to empty array
                setLoading(false);
            });
    }, []);

    return (
        <SectionFrame
            id="github-activity"
            label="GITHUB ACTIVITY"
            number="08"
        >
            <div className="github-content">
                <AnimateIn animation="fade-up" duration={0.8} threshold={0.2}>
                    <div className="github-stats">
                        <h3 className="github-heading">Contribution Graph</h3>
                        <div className="github-graph-wrapper">
                            <img
                                src={`https://ghchart.rshah.org/${username}`}
                                alt="GitHub Contribution Graph"
                                className="github-graph"
                            />
                        </div>
                    </div>
                </AnimateIn>

                <AnimateIn animation="fade-up" delay={0.2} duration={0.8} threshold={0.2}>
                    <div className="github-repos">
                        <h3 className="github-heading">Recent Projects</h3>
                        {loading ? (
                            <div className="repos-loading">Loading repositories...</div>
                        ) : (
                            <div className="repos-grid">
                                {repos.slice(0, 3).map((repo) => (
                                    <a
                                        key={repo.id}
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="repo-card"
                                    >
                                        <h4 className="repo-name">{repo.name}</h4>
                                        <p className="repo-description">
                                            {repo.description || 'No description available'}
                                        </p>
                                        <div className="repo-meta">
                                            {repo.language && (
                                                <span className="repo-language">{repo.language}</span>
                                            )}
                                            <span className="repo-stat">
                                                <Star size={14} /> {repo.stargazers_count}
                                            </span>
                                            <span className="repo-stat">
                                                <GitFork size={14} /> {repo.forks_count}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                        <a
                            href={`https://github.com/${username}?tab=repositories`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-all-repos"
                        >
                            View All Repositories →
                        </a>
                    </div>
                </AnimateIn>
            </div>
        </SectionFrame>
    );
};

export default memo(GitHubActivity);
