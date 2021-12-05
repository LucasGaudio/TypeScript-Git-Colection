import React, { useState, useEffect, useRef, FC, ChangeEvent, FormEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import { Title, Form, Repos, Error } from "./styles";
import logo from "../../assets/logo.svg";
import { api } from "../../services/api";

interface GithubRepository {
	full_name: string;
	description: string;
	owner: {
		login: string;
		avatar_url: string;
	};
}

const Dashboard: FC = () => {
	const [repos, setRepos] = useState<GithubRepository[]>(() => {
		const storageRepos = localStorage.getItem("@Gitcollection:repositories");
		if (storageRepos) {
			return JSON.parse(storageRepos);
		} else {
			return [];
		}
	});

	const [newRepo, setNewRepo] = useState("");
	const [inputError, setInputError] = useState("");
	const formEl = useRef<HTMLFormElement | null>(null);

	useEffect(() => {
		localStorage.setItem("@Gitcollection:repositories", JSON.stringify(repos));
	}, [repos]);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setNewRepo(event.target.value);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!newRepo) {
			setInputError("Informe o username/repositório");
			return;
		}

		try {
			const response = await api.get<GithubRepository>(`/repos/${newRepo}`);
			const repository = response.data;

			console.log(repository);

			setRepos([...repos, repository]);
			formEl.current?.reset();
			setNewRepo("");
			setInputError("");
		} catch {
			setInputError("Repositorio não encontrado no GitHub");
		}
	};

	return (
		<>
			<img src={logo} alt="GitCollection" />
			<Title>Catálogo de repositórios do Github</Title>
			<Form ref={formEl} hasError={Boolean(inputError)} onSubmit={handleSubmit}>
				<input placeholder="username/repository_name" onChange={handleInputChange} />
				<button type="submit">Search</button>
			</Form>
			{inputError && <Error>{inputError}</Error>}
			<Repos>
				{repos.map((repository, index) => (
					<Link to={`/repositories/${repository.full_name}`} key={repository.full_name + index}>
						<img src={repository.owner.avatar_url} alt={repository.owner.login} />
						<div>
							<strong>{repository.full_name}</strong>
							<p>{repository.description}</p>
						</div>
						<FiChevronRight size={20} />
					</Link>
				))}
			</Repos>
		</>
	);
};

export default Dashboard;