# PyTorch Shim for CareerPath Browser Editor
# This provides a mock 'torch' module to allow basic tutorial snippets to run.

import numpy as np
import sys
from types import ModuleType

# Create the torch module
torch = ModuleType("torch")
torch.__version__ = "2.1.0+mock"

class Tensor:
    def __init__(self, data, requires_grad=False, device="cpu"):
        if isinstance(data, (list, tuple)):
            self.data = np.array(data)
        elif isinstance(data, np.ndarray):
            self.data = data
        elif isinstance(data, (int, float)):
            self.data = np.array([data])
        else:
            self.data = data
        
        self.requires_grad = requires_grad
        self.device = device
        self.grad = None
        self.shape = self.data.shape
        self.ndim = self.data.ndim
        self.dtype = self.data.dtype

    def __repr__(self):
        return f"tensor({self.data.tolist()}, requires_grad={self.requires_grad})"

    def __add__(self, other):
        other_data = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data + other_data, requires_grad=self.requires_grad)

    def __mul__(self, other):
        other_data = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data * other_data, requires_grad=self.requires_grad)

    def __matmul__(self, other):
        return Tensor(self.data @ other.data, requires_grad=self.requires_grad)

    def sum(self):
        return Tensor(self.data.sum(), requires_grad=self.requires_grad)

    def item(self):
        return self.data.item()

    def backward(self):
        print("Note: Autograd is simulated. Gradients computed for mock parameters.")
        if self.requires_grad:
            self.grad = Tensor(np.ones_like(self.data))

    @property
    def T(self):
        return Tensor(self.data.T, requires_grad=self.requires_grad)

    def to(self, device):
        print(f"Moving tensor to {device}...")
        self.device = device
        return self

    def view(self, *shape):
        return Tensor(self.data.reshape(*shape), requires_grad=self.requires_grad)

def tensor(data, requires_grad=False):
    return Tensor(data, requires_grad=requires_grad)

def rand(*shape, requires_grad=False):
    return Tensor(np.random.rand(*shape), requires_grad=requires_grad)

def ones(*shape, requires_grad=False):
    return Tensor(np.ones(shape), requires_grad=requires_grad)

def zeros(*shape, requires_grad=False):
    return Tensor(np.zeros(shape), requires_grad=requires_grad)

def matmul(a, b):
    return a @ b

torch.tensor = tensor
torch.rand = rand
torch.ones = ones
torch.zeros = zeros
torch.matmul = matmul
torch.float = np.float32
torch.int = np.int32

# torch.nn
nn = ModuleType("torch.nn")
class Module:
    def __init__(self):
        self._parameters = {}
    
    def __call__(self, x):
        return self.forward(x)
    
    def forward(self, x):
        raise NotImplementedError
    
    def parameters(self):
        return []

    def eval(self):
        print("Model set to evaluation mode.")
        return self

    def to(self, device):
        print(f"Model moved to {device}.")
        return self

class Linear(Module):
    def __init__(self, in_features, out_features):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.weight = Tensor(np.random.randn(out_features, in_features), requires_grad=True)
        self.bias = Tensor(np.random.randn(out_features), requires_grad=True)

    def forward(self, x):
        return x @ self.weight.T + self.bias

    def __repr__(self):
        return f"Linear(in_features={self.in_features}, out_features={self.out_features}, bias=True)"

nn.Module = Module
nn.Linear = Linear
nn.Conv2d = lambda *args, **kwargs: "Mock Conv2d"
nn.MaxPool2d = lambda *args, **kwargs: "Mock MaxPool2d"
nn.CrossEntropyLoss = lambda: lambda pred, target: Tensor(0.5)

torch.nn = nn

# torch.nn.functional
f = ModuleType("torch.nn.functional")
def relu(x):
    if isinstance(x, Tensor):
        return Tensor(np.maximum(0, x.data))
    return np.maximum(0, x)

def binary_cross_entropy_with_logits(input, target):
    return Tensor(0.693, requires_grad=True)

f.relu = relu
f.binary_cross_entropy_with_logits = binary_cross_entropy_with_logits
torch.nn.functional = f

# torch.optim
optim = ModuleType("torch.optim")
class Optimizer:
    def __init__(self, params, lr=0.01):
        self.params = params
        self.lr = lr
    def step(self): pass
    def zero_grad(self): pass

class SGD(Optimizer): pass
class Adam(Optimizer): pass

optim.SGD = SGD
optim.Adam = Adam
torch.optim = optim

# torch.utils.data
utils = ModuleType("torch.utils")
data = ModuleType("torch.utils.data")
class Dataset: pass
class DataLoader:
    def __init__(self, dataset, batch_size=1):
        self.dataset = dataset
        self.batch_size = batch_size
    def __iter__(self):
        yield Tensor(np.random.rand(self.batch_size, 1, 28, 28)), Tensor([1]*self.batch_size)

data.Dataset = Dataset
data.DataLoader = DataLoader
utils.data = data
torch.utils = utils

# Add to sys.modules so 'import torch' works
sys.modules["torch"] = torch
sys.modules["torch.nn"] = nn
sys.modules["torch.nn.functional"] = f
sys.modules["torch.optim"] = optim
sys.modules["torch.utils"] = utils
sys.modules["torch.utils.data"] = data

# Mock torchvision
torchvision = ModuleType("torchvision")
datasets = ModuleType("torchvision.datasets")
datasets.FashionMNIST = lambda *args, **kwargs: "Mock FashionMNIST"
torchvision.datasets = datasets
torchvision.transforms = ModuleType("torchvision.transforms")
torchvision.transforms.ToTensor = lambda: lambda x: x
sys.modules["torchvision"] = torchvision
sys.modules["torchvision.datasets"] = datasets
sys.modules["torchvision.transforms"] = torchvision.transforms

print("PyTorch Mock Shim Loaded! (Basic CPU simulation using NumPy)")
