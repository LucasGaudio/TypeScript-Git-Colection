import React, { useState, useEffect, FC } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { api } from "../../services/api";
import { Header, RepoInfo, Issues } from "./styles";
import logo from "../../assets/logo.svg";

interface RepositoryParams {
	repository: string;
}

interface GitRepository {
	forks_count: number;
	open_issues_count: number;
	stargazers_count: number;
	full_name: string;
	description: string;
	owner: {
		login: string;
		avatar_url: string;
	};
}

interface GitHubIssue {
	id: number;
	title: string;
	html_url: string;
	user: {
		login: string;
	};
}

const Repo: FC = () => {
	const [repository, setRepository] = useState<GitRepository | null>(null);
	const [issues, setIssues] = useState<GitHubIssue[]>([]);

	const { params } = useRouteMatch<RepositoryParams>();

	useEffect(() => {
		api.get(`repos/${params.repository}`).then(response => setRepository(response.data));
		api.get(`repos/${params.repository}/issues`).then(response => setIssues(response.data));
	}, [params.repository]);

	return (
		<>
			<Header>
				<img src={logo} alt={"GitCollection"} />
				<Link to="/">
					<FiChevronLeft /> Back
				</Link>
			</Header>

			{repository && (
				<RepoInfo>
					<header>
						<img src={repository.owner.avatar_url} alt={repository.owner.login} />
						<div>
							<strong>{repository.full_name}</strong>
							<p>{repository.description}</p>
						</div>
					</header>
					<ul>
						<li>
							<strong>{repository.stargazers_count}</strong>
							<span>Stars</span>
						</li>
						<li>
							<strong>{repository.forks_count}</strong>
							<span>Forks</span>
						</li>
						<li>
							<strong>{repository.open_issues_count}</strong>
							<span>Issues abertas</span>
						</li>
					</ul>
				</RepoInfo>
			)}

			<Issues>
				{issues.map(issue => (
					<a href={issue.html_url} target="_blank" rel="noreferrer" key={issue.id}>
						<div>
							<strong>{issue.title}</strong>
							<p>{issue.user.login}</p>
						</div>
						<FiChevronRight />
					</a>
				))}
			</Issues>
		</>
	);
};

export default Repo